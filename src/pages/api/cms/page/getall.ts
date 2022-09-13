import { mongoConnect } from 'src/coreApi/database/mongodb';
import PageSchema from 'src/coreApi/schemas/page';
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

  await PageSchema.find(query)
    .skip(pagination.skip)
    .limit(pagination.limit)
    .populate('project')
    .then(async (page) => {
      if (page) {
        pagination.total = await PageSchema.countDocuments(query);
        res.status(200).json({ page, pagination });
      } else {
        res.status(404).json({
          message: 'Page not found',
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
