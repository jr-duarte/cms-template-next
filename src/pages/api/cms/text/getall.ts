import { mongoConnect } from 'src/coreApi/database/mongodb';
import TextSchema from 'src/coreApi/schemas/text';
import mongoose from 'mongoose';
import type { NextApiRequest, NextApiResponse } from 'next';

let connection: typeof mongoose;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!connection) {
    connection = await mongoConnect();
  }

  const { skip, limit } = req.query;

  const pagination = {
    skip: +skip || 0,
    limit: +limit || 10,
    total: 0,
  };

  const query: any = {};

  await TextSchema.find(query)
    .skip(pagination.skip)
    .limit(pagination.limit)
    .populate('page')
    .then(async (text) => {
      if (text) {
        pagination.total = await TextSchema.countDocuments(query);
        res.status(200).json({ text, pagination });
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
