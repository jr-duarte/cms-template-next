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

  const { name, email, password, role } = req.body;

  const data = {
    name,
    email,
    password: bcrypt.hashSync(password, 10),
    role,
  };

  await UserSchema.create(data)
    .then(async (user: any) => {
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
    })
    .catch((err) => {
      res.status(400).json({ message: err.message });
    });
}
