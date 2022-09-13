import { mongoConnect } from 'src/coreApi/database/mongodb';
import UserSchema from 'src/coreApi/schemas/user';
import * as bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import type { NextApiRequest, NextApiResponse } from 'next';

let connection: typeof mongoose;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!connection) {
    connection = await mongoConnect();
  }

  const { email, password } = req.body;

  const user = await UserSchema.findOne({ email });

  if (user && bcrypt.compareSync(password, user.password)) {
    res.status(200).json({
      user: { name: user.name, email: user.email, role: user.role },
      accessToken: jwt.sign(
        { name: user.name, email: user.email, role: user.role },
        process.env.JWT_SECRET_KEY as string,
        {
          expiresIn: process.env.JWT_EXPIRESIN as string,
        }
      ),
    });
  } else {
    res.status(400).json({
      message: 'Email ou Senha inválidos',
    });
  }
}
