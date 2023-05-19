// pages/api/supabase-fetch-id.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '../../../types_db';

// Function to process GET requests
async function processGet(database: string, supabase: any, id: string) {
  const { data, error } = await supabase.from(database).select('*').eq('id', id);
  if (error) {
    console.error('Error while fetching data:', error);
    return [];
  }
  return data;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const supabase = createServerSupabaseClient<Database>({ req, res });
    const database = req.query.database as string;
    const id = req.query.id as string;

    switch (req.method) {
      case 'GET':
        const getResult = await processGet(database, supabase, id);
        res.status(200).json({ result: getResult });
        break;
      default:
        res.status(400).json({ error: 'Method not supported' });
        break;
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}