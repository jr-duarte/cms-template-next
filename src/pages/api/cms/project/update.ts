import { mongoConnect } from 'src/coreApi/database/mongodb';
import ProjectSchema from 'src/coreApi/schemas/project';
import mongoose from 'mongoose';
import type { NextApiRequest, NextApiResponse } from 'next';
import { TProject } from 'src/@types/project';

let connection: typeof mongoose;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!connection) {
    connection = await mongoConnect();
  }

  const { id } = req.query;
  const body = req.body;

  await ProjectSchema.findByIdAndUpdate(id, body, {
    new: true,
  })
    .then(async (project: TProject) => {
      if (project) {
        res.status(200).json(project);
      } else {
        res.status(404).json({
          message: 'Project not found',
        });
      }
    })
    .catch((err) => {
      res.status(400).json({ message: err.message });
    });
}
