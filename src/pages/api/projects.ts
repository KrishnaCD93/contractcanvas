// pages/api/projects.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/supabase';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;

  switch (method) {
    case 'GET':
      await handleGet(req, res);
      break;
    case 'POST':
      await handlePost(req, res);
      break;
    case 'PUT':
      await handlePut(req, res);
      break;
    case 'DELETE':
      await handleDelete(req, res);
      break;
    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
};

async function handleGet(req: NextApiRequest, res: NextApiResponse) {
  const { data, error } = await supabase.from('projects').select('*');

  if (error) {
    res.status(500).json({ error: error.message });
  } else {
    res.status(200).json(data);
  }
}

async function handlePost(req: NextApiRequest, res: NextApiResponse) {
  const { title, description, user_id } = req.body;

  if (!title || !description || !user_id) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }

  const { data, error } = await supabase
    .from('projects')
    .insert([{ title, description, user_id, created_at: new Date() }]);

  if (error) {
    res.status(500).json({ error: error.message });
  } else if (data) {
    res.status(201).json(data[0]);
  }
}

async function handlePut(req: NextApiRequest, res: NextApiResponse) {
  const { id, title, description } = req.body;

  if (!id || (!title && !description)) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }

  const { data, error } = await supabase
    .from('projects')
    .update({ title, description })
    .eq('id', id);

  if (error) {
    res.status(500).json({ error: error.message });
  } else if (data) {
    res.status(200).json(data[0]);
  }
}

async function handleDelete(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (!id) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }

  const { data, error } = await supabase.from('projects').delete().eq('id', id);

  if (error) {
    res.status(500).json({ error: error.message });
  } else if (data) {
    res.status(200).json(data[0]);
  }
}

export default handler;
