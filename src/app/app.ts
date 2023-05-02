import express, { NextFunction, Request, Response } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRouter from './routes/auth.routes';
import userRouter from './routes/user.routes';
import redisClient from '../utils/redis/connectRedis';
import { ROUTE } from './routes/listRoutes';
import config from 'config';
import { CONFIG } from '../utils/env/enums';
import AppError from '../utils/error/AppError';

const app = express();

app.use(express.json({ limit: '10kb' }));

if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

app.use(cookieParser());

app.use(
  cors({
    origin: config.get<string>(CONFIG.ORIGIN),
    credentials: true,
  })
);

app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);

app.get(ROUTE.redis, async (req: Request, res: Response) => {
  const message = await redisClient.get('try');
  return res.status(200).send({
    status: 'success',
    message,
  });
});

app.all('*', (req: Request, res: Response, next: NextFunction) => {
  next(new AppError(404, `Route ${req.originalUrl} not found`));
});

// GLOBAL ERROR HANDLER
app.use(
  (error: AppError, req: Request, res: Response, next: NextFunction) => {
    error.status = error.status || 'error';
    error.statusCode = error.statusCode || 500;

    res.status(error.statusCode).json({
      status: error.status,
      message: error.message,
    });
  }
);

export default app;
