import { NextFunction, Request } from 'express';
import { findUserById } from '../services/user.service';
import AppError from '../utils/error/AppError';
import { verifyJwt } from '../utils/jwt/verifyJwt';
import { NameKeyPublicToken } from '../utils/jwt/types';
import redisClient from '../utils/redis/connectRedis';
import { ResponseServer } from '../types/types';
import { STATUS_CODE, STATUS_RESPONSE } from '../types/enums';

export const deserializeUser = async (
  req: Request,
  res: ResponseServer,
  next: NextFunction
) => {
  try {
    let access_token: string = '';

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      access_token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.access_token) {
      access_token = req.cookies.access_token;
    }

    if (!access_token) {
      return next(
        new AppError(
          STATUS_CODE.UNAUTHORIZED,
          STATUS_RESPONSE.FAIL,
          'You are not logged in'
        )
      );
    }

    // Validate the access token
    const decoded = verifyJwt<{ sub: string }>(
      access_token,
      NameKeyPublicToken.accessTokenPublic
    );

    if (!decoded) {
      return next(
        new AppError(
          STATUS_CODE.UNAUTHORIZED,
          STATUS_RESPONSE.FAIL,
          `Invalid token or user doesn't exist`
        )
      );
    }

    // Check if the user has a valid session
    const session = await redisClient.get(decoded.sub);

    if (!session) {
      return next(
        new AppError(
          STATUS_CODE.UNAUTHORIZED,
          STATUS_RESPONSE.FAIL,
          `Invalid token or session has expired`
        )
      );
    }

    // Check if the user still exist
    const user = await findUserById(JSON.parse(session).id);

    if (!user) {
      return next(
        new AppError(
          STATUS_CODE.UNAUTHORIZED,
          STATUS_RESPONSE.FAIL,
          `Invalid token or session has expired`
        )
      );
    }

    // Add user to res.locals
    res.locals.user = user;

    next();
  } catch (err: unknown) {
    next(err);
  }
};
