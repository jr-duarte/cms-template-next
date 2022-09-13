import { IReqAPI } from 'src/coreApi/interfaces/IReqAPI';
import jwt from 'jsonwebtoken';
import type { NextApiResponse } from 'next';

const withAuth =
  (handler: (req: IReqAPI, res: NextApiResponse) => any) =>
  (req: IReqAPI, res: NextApiResponse) => {
    const token = req?.headers?.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as string);
      req.user = decoded;
      return handler(req, res);
    } catch (err) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
  };

export default withAuth;
