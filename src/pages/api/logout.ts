// pages/api/logout.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../supabase';

const logout = async (req: NextApiRequest, res: NextApiResponse) => {
  const { error } = await supabase.auth.signOut();

  if (error) {
    return res.status(401).json({ error: error.message });
  }

  return res.status(200).json({ message: 'Logged out successfully' });
};

export default logout;
