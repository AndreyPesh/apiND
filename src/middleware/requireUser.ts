import { NextFunction, Request } from 'express';
import AppError from '../utils/error/AppError';
import { ResponseServer } from '../types/types';
import { STATUS_CODE, STATUS_RESPONSE } from '../types/enums';

export const requireUser = (
  req: Request,
  res: ResponseServer,
  next: NextFunction
) => {
  try {
    const user = res.locals.user;

    if (!user) {
      return next(
        new AppError(
          STATUS_CODE.BAD_REQUEST,
          STATUS_RESPONSE.FAIL,
          `Session has expired or user doesn't exist`
        )
      );
    }

    next();
  } catch (err: unknown) {
    next(err);
  }
};
