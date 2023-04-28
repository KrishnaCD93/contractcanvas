import { createClient } from 'redis';

const client = createClient({
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: 'redis-10718.c279.us-central1-1.gce.cloud.redislabs.com',
        port: 10718
    }
});

export default client;