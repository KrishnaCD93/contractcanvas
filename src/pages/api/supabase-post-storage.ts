// /pages/api/supabase-post-storage.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '../../../types_db';

export default async function handleUpload(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    await uploadSingleFile(req, res);
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}

async function uploadSingleFile(req: NextApiRequest, res: NextApiResponse) {
  const supabase = createServerSupabaseClient<Database>({ req, res });
  const file = req.body.file;

  if (!file) {
    return res.status(400).json({ error: 'No file provided' });
  }

  const fileExtension = file.name.split('.').pop();
  const fileName = `uploads/${new Date().getTime()}.${fileExtension}`;

  const { data: fileUrl, error: uploadError } = await supabase.storage
    .from('resumes')
    .upload(fileName, file);

  if (uploadError) {
    console.error('Error uploading file:', uploadError);
    return res.status(500).json({ error: 'Error uploading file' });
  }

  return res.status(200).json({ message: 'File uploaded successfully', fileUrl });
}

