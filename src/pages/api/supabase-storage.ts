// /pages/api/supabase-storage.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '../../../types_db';

// Function to process POST requests
async function processPost(req: NextApiRequest, res: NextApiResponse, supabase: any) {
  const file = req.body.file;

  if (!file) {
    return res.status(400).json({ error: 'No file provided' });
  }

  const fileExtension = file.name.split('.').pop();
  const fileName = `${new Date().getTime()}.${fileExtension}`;

  const { error: uploadError } = await supabase.storage
    .from('resumes')
    .upload(fileName, file);

  if (uploadError) {
    console.error('Error uploading file:', uploadError);
    return res.status(500).json({ error: 'Error uploading file' });
  }

  return res.status(200).json({ message: 'File uploaded successfully', fileName });
}

// Function to process GET requests
async function processGet(req: NextApiRequest, res: NextApiResponse, supabase: any) {
  const fileName = req.query.fileName as string;

  const { data, error } = await supabase.storage
    .from('resumes')
    .download(fileName);

  if (error) {
    console.error('Error downloading file:', error);
    return res.status(500).json({ error: 'Error downloading file' });
  }

  return res.status(200).json({ file: data });
}

// Function to process DELETE requests
async function processDelete(req: NextApiRequest, res: NextApiResponse, supabase: any) {
  const fileName = req.query.fileName as string;

  const { error: deleteError } = await supabase.storage
    .from('resumes')
    .remove([fileName]);

  if (deleteError) {
    console.error('Error deleting file:', deleteError);
    return res.status(500).json({ error: 'Error deleting file' });
  }

  return res.status(200).json({ message: 'File deleted successfully' });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const supabase = createServerSupabaseClient<Database>({ req, res });

  switch (req.method) {
    case 'POST':
      await processPost(req, res, supabase);
      break;
    case 'GET':
      await processGet(req, res, supabase);
      break;
    case 'DELETE':
      await processDelete(req, res, supabase);
      break;
    default:
      res.status(405).json({ message: 'Method not allowed' });
  }
}
