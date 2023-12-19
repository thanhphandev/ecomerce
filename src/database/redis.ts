import { createClient } from 'redis';
import 'dotenv/config';

export const client = createClient({
    socket: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT || '6379', 10)
    }
});

client.on('connect', () => {
  console.log('Redis client connected');
});

client.on('error', (err) => {
  console.log(`Redis client could not connect: ${err}`);
});

export default client;
