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

  const { id } = req.query;

  await TextSchema.findById(id)
    .then(async (text: TText) => {
      if (text) {
        res.status(200).json(text);
      } else {
        res.status(404).json({
          message: 'Text not found',
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        message: 'Server error',
        error: err,
      });
    });
}
