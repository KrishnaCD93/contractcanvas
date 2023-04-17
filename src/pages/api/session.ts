// pages/api/session.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../supabase';

const session = async (req: NextApiRequest, res: NextApiResponse) => {
  const token = req.headers.token as string;

  const { data: user, error } = await supabase.auth.getUser(token);

  if (error) {
    return res.status(401).json({ error: error.message });
  }

  return res.status(200).json(user);
};

export default session;
