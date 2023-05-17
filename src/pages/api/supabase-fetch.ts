// /pages/api/supabase-fetch.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '../../../types_db';

// Function to process POST requests
async function processPost(database: string, values: any[], supabase: any): Promise<string[]> {
  const { data, error } = await supabase.from(database).insert(values).select();

  if (error) {
    console.error('Error while uploading value:', error);
    return [''];
  }
  console.log('Data:', data);
  return data ? data.map((item: any) => item.id) : [''];
}

// Function to process GET requests
async function processGet(database: string, supabase: any) {
  const { data, error } = await supabase.from(database).select('*');
  if (error) {
    console.error('Error while fetching data:', error);
    return [];
  }
  return data;
}

// Function to process DELETE requests
async function processDelete(database: string, id: string, supabase: any) {
  const { data, error } = await supabase.from(database).delete().eq('id', id);
  if (error) {
    console.error('Error while deleting data:', error);
    return [];
  }
  return data;
}

// Function to process PUT requests
async function processPut(database: string, id: string, values: any[], supabase: any) {
  const { data, error } = await supabase.from(database).update(values).eq('id', id);
  if (error) {
    console.error('Error while updating data:', error);
    return [];
  }
  return data;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const supabase = createServerSupabaseClient<Database>({ req, res });
    const database = req.query.database as string;

    switch (req.method) {
      case 'POST':
        const postValues = req.body.values;
        const postResult = await processPost(database, postValues, supabase);
        res.status(200).json({ result: postResult });
        break;
      case 'GET':
        const getResult = await processGet(database, supabase);
        res.status(200).json({ result: getResult });
        break;
      case 'DELETE':
        const deleteId = req.query.id as string;
        const deleteResult = await processDelete(database, deleteId, supabase);
        res.status(200).json({ result: deleteResult });
        break;
      case 'PUT':
        const putId = req.query.id as string;
        const putValues = req.body.values;
        const putResult = await processPut(database, putId, putValues, supabase);
        res.status(200).json({ result: putResult });
        break;
      default:
        res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
