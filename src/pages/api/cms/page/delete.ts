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

  const { id } = req.query;

  await PageSchema.findByIdAndRemove(id)
    .then(async (page: TPage) => {
      if (page) {
        res.status(200).json(page);
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
