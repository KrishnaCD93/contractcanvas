// /pages/api/supabase-get.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function fetchRecords(database: string) {
  const { data, error } = await supabase.from(database).select('*');
  if (error) throw error;
  return data;
}

export default async function handlerProjects (req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'GET') {
      const database = req.query.database as string;
      const data = await fetchRecords(database);
      res.status(200).json({ result: data });
    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
