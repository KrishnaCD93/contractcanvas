// /pages/api/supabase-post.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '../../../types_db';

type Data = {
  result: string;
};

export default async function handleChange(req: NextApiRequest, res: NextApiResponse<Data>) {
  const supabase = createServerSupabaseClient<Database>({ req, res });
  console.log('req', req.body)
  const database = req.body.database;
  const values = req.body.values;

  // Process the value (e.g., validation, transformation, etc.)
  const result = await processValue(database, values, supabase);
  console.log('result', result)
  res.status(200).json({ result });
}

async function processValue(database: string, values: any[], supabase: any): Promise<string> {
  const { data, error } = await supabase.from(database).insert(values).select();

  if (error) {
    console.error('Error while uploading value:', error);
    return '';
  }

  return data && data.length > 0 ? data[0].id : '';
}
