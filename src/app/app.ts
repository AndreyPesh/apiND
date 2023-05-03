import express, { NextFunction, Request, Response } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRouter from './routes/auth.routes';
import userRouter from './routes/user.routes';
import { ROUTE } from './routes/listRoutes';
import config from 'config';
import { CONFIG } from '../utils/env/enums';
import AppError from '../utils/error/AppError';
import { globalErrorHandler } from '../utils/error/errorHandler';
import { STATUS_CODE, STATUS_RESPONSE } from '../types/enums';

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

app.use(ROUTE.AUTH, authRouter);
app.use(ROUTE.USERS, userRouter);

app.all(ROUTE.ALL, (req: Request, res: Response, next: NextFunction) => {
  next(
    new AppError(
      STATUS_CODE.NOT_FOUND,
      STATUS_RESPONSE.ERROR,
      `Route ${req.originalUrl} not found`
    )
  );
});

// GLOBAL ERROR HANDLER
app.use(globalErrorHandler);

export default app;
