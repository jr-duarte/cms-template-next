import { IReqAPI } from 'src/coreApi/interfaces/IReqAPI';
import withAuth from 'src/coreApi/middlewares/withAuth';
import type { NextApiResponse } from 'next';

async function handler(req: IReqAPI, res: NextApiResponse) {
  res.status(200).json({
    message: `Rota Autenticada Acessada ${req?.user?.email}`,
  });
}

export default withAuth(handler);
