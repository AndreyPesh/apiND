import { NextFunction, Request } from 'express';
import AppError from './AppError';
import { ResponseServer } from '../../types/types';
import { STATUS_CODE, STATUS_RESPONSE } from '../../types/enums';

export const globalErrorHandler = (
  error: AppError,
  req: Request,
  res: ResponseServer,
  next: NextFunction
) => {
  error.status = error.status || STATUS_RESPONSE.error;
  error.statusCode = error.statusCode || STATUS_CODE.INTERNAL_ERROR;

  res.status(error.statusCode).json({
    status: error.status,
    message: error.message,
  });
};
