import type { NextApiRequest } from 'next';

export interface IReqAPI extends NextApiRequest {
  user: any;
}
