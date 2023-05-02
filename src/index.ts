import dotenv from 'dotenv';
dotenv.config();
import config from 'config';
import app from './app/app';
import { connectDB } from './utils/db/connectDB';
import validateEnv from './utils/env/validateEnv';
import { CONFIG } from './utils/env/enums';
import { connectRedis } from './utils/redis/connectRedis';
import './utils/jwt/signJwt'

const PORT = config.get<number>(CONFIG.PORT);

const startApp = async () => {
  try {
    validateEnv();
    await connectRedis()
    const isConnected = await connectDB();
    if (isConnected) {
      app.listen(PORT, () => {
        console.log(`Express server has started on port ${PORT}`);
      });
    } else {
      throw new Error('Cant connect to database!');
    }
  } catch (error) {
    console.log(`Cant start app! ${error.message}`);
  }
};

startApp();
