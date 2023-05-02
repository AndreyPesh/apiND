import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import redisClient from '../utils/redis/connectRedis';
import { ROUTE } from './routes/listRoutes';

const app = express();
app.use(bodyParser.json());

app.get(ROUTE.redis, async (req: Request, res: Response) => {
  const message = await redisClient.get('try');
  return res.status(200).send({
    status: 'success',
    message
  })
});

export default app;
