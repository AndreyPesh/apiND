import { NextFunction, Request } from 'express';
import { ResponseServer } from '../types/types';
import { STATUS_CODE, STATUS_RESPONSE } from '../types/enums';

export const getMeHandler = async (
  req: Request,
  res: ResponseServer,
  next: NextFunction
) => {
  try {
    const user = res.locals.user;

    res.status(STATUS_CODE.OK).json({
      status: STATUS_RESPONSE.SUCCESS,
      data: {
        user,
      },
    });
  } catch (err: unknown) {
    next(err);
  }
};
