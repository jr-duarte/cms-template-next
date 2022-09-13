import { mongoConnect } from 'src/coreApi/database/mongodb';
import TextSchema from 'src/coreApi/schemas/text';
import mongoose from 'mongoose';
import type { NextApiRequest, NextApiResponse } from 'next';
import { TText } from 'src/@types/text';

let connection: typeof mongoose;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!connection) {
    connection = await mongoConnect();
  }

  const dataReq = req.body;

  const data = {
    ...dataReq,
  };

  await TextSchema.create(data)
    .then(async (text: TText) => {
      res.status(200).json(text);
    })
    .catch((err) => {
      res.status(400).json({ message: err.message });
    });
}
