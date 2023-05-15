// /pages/api/redis-storage.ts
import { NextApiRequest, NextApiResponse } from 'next';
import client from '../../../redis';

const storeZKPData = async (key: string, data: string) => {
  try {
    // Redis only accepts strings as values, so we need to stringify the data
    const dataString = JSON.stringify(data);
    
    // 'set' method to store data in Redis
    const reply = await client.set(key, dataString);

    client.quit();
    console.log('Redis reply:', reply);
  } catch (error) {
    console.log('Error storing ZKP data in Redis:', error);
  }
};

const getZKPData = async (key: string) => {
  try {
    // 'get' method to retrieve data from Redis
    const dataString = await client.get(key);

    if (!dataString) {
      console.log('No data found in Redis');
      return {};
    }
    // Parse the data back into its original form
    const data = JSON.parse(dataString);

    console.log('Retrieved ZKP data:', data);

    client.quit();
    return data;
  } catch (error) {
    console.log('Error retrieving ZKP data from Redis:', error);
  }
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { method } = req;

    switch (method) {
      case 'POST':
        const { key, data } = req.body;
        await storeZKPData(key, data);
        res.status(200).json({ result: 'success' });
        break;
      case 'GET':
        const { key: getKey } = req.query;
        const result = await getZKPData(getKey as string);
        res.status(200).json({ result });
        break;
      default:
        res.setHeader('Allow', ['POST', 'GET']);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
}