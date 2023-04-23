// /pages/api/supabase-post.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '../../../types_db';

type Data = {
  result: string;
};

export default async function handleChange(req: NextApiRequest, res: NextApiResponse<Data>) {
  const supabase = createServerSupabaseClient<Database>({ req, res });
  const database = req.body.database;
  const values = req.body.values;

  // Process the value (e.g., validation, transformation, etc.)
  const result = await processValue(database, values, supabase);

  res.status(200).json({ result });
}

async function processValue(database: string, values: any[], supabase: any): Promise<string> {
  const { data, error } = await supabase.from(database).insert([{ values }]);

  if (error) {
    console.error('Error while uploading value:', error);
    return '';
  }

  return data ? data[0].value : '';
}
