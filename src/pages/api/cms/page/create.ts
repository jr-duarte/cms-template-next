import { mongoConnect } from 'src/coreApi/database/mongodb';
import PageSchema from 'src/coreApi/schemas/page';
import mongoose from 'mongoose';
import type { NextApiRequest, NextApiResponse } from 'next';
import { TPage } from 'src/@types/page';

let connection: typeof mongoose;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!connection) {
    connection = await mongoConnect();
  }

  const dataReq = req.body;

  const data = {
    ...dataReq,
  };

  await PageSchema.create(data)
    .then(async (page: TPage) => {
      res.status(200).json(page);
    })
    .catch((err) => {
      res.status(400).json({ message: err.message });
    });
}
