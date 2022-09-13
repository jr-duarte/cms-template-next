import { mongoConnect } from 'src/coreApi/database/mongodb';
import ProjectSchema from 'src/coreApi/schemas/project';
import mongoose from 'mongoose';
import type { NextApiRequest, NextApiResponse } from 'next';
import { TProject } from 'src/@types/project';
import withAuth from 'src/coreApi/middlewares/withAuth';

let connection: typeof mongoose;

async function handler(req: NextApiRequest, res: NextApiResponse) {
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

  await ProjectSchema.find(query)
    .skip(pagination.skip)
    .limit(pagination.limit)
    .then(async (project: TProject[]) => {
      if (project) {
        pagination.total = await ProjectSchema.countDocuments(query);
        res.status(200).json({ project, pagination });
      } else {
        res.status(404).json({
          message: 'Project not found',
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

export default withAuth(handler);
