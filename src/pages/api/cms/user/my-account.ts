import jwt from 'jsonwebtoken';

import type { NextApiRequest, NextApiResponse } from 'next';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = req?.headers?.authorization?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'Autorização Negada' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as string);
    const { name, email, role } = decoded as { name: string; email: string; role: string };
    return res.status(200).json({ user: { name, email, role } });
  } catch (err) {
    return res.status(401).json({ message: 'Autorização Negada' });
  }
}

export default handler;
