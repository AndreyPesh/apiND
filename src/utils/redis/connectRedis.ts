import dotenv from 'dotenv';
dotenv.config();
import config from 'config';
import { createClient } from 'redis';
import { CONFIG } from '../env/enums';

const redisClient = createClient({
  url: config.get<string>(CONFIG.REDIS_HOST),
});

export const connectRedis = async () => {
  try {
    await redisClient.connect();
    console.log('Redis client connected successfully');
    redisClient.set('try', 'Hello Welcome to Express with TypeORM');
  } catch (error) {
    console.log(error);
    setTimeout(connectRedis, 5000);
  }
};

export default redisClient;
