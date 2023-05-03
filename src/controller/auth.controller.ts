import { NextFunction, Request } from 'express';
import {
  CreateUserInput,
  createUser,
  findUserByEmail,
  findUserById,
} from '../services/user.service';
import { User } from '../entities/user.entity';
import AppError from '../utils/error/AppError';
import { signTokens } from '../utils/jwt/signTokens';
import { verifyJwt } from '../utils/jwt/verifyJwt';
import { NameKeyPrivateToken, NameKeyPublicToken } from '../utils/jwt/types';
import redisClient from '../utils/redis/connectRedis';
import { signJwt } from '../utils/jwt/signJwt';
import config from 'config';
import { CONFIG } from '../utils/env/enums';
import { STATUS_CODE, STATUS_RESPONSE } from '../types/enums';
import { ResponseServer } from '../types/types';
import {
  addCookieToResponse,
  logout,
  updateAccessToken,
} from '../utils/cookie/helpers';

export const registerUserHandler = async (
  req: Request<{}, {}, CreateUserInput>,
  res: ResponseServer,
  next: NextFunction
) => {
  try {
    const { name, password, email } = req.body;

    const user = await createUser({
      name,
      email: email.toLowerCase(),
      password,
    });

    res.status(STATUS_CODE.CREATED).json({
      status: STATUS_RESPONSE.SUCCESS,
      data: {
        user,
      },
    });
  } catch (err: unknown) {
    const CODE_DB_IS_EXIST = '23505';
    if ((err as { code: string }).code === CODE_DB_IS_EXIST) {
      return res.status(STATUS_CODE.CONFLICT).json({
        status: STATUS_RESPONSE.FAIL,
        message: 'User with that email already exist',
      });
    }
    next(err);
  }
};

export const loginUserHandler = async (
  req: Request<{}, {}, { email: string; password: string }>,
  res: ResponseServer,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;
    const user = await findUserByEmail({ email });

    //1. Check if user exists and password is valid
    if (!user || !(await User.comparePasswords(password, user.password))) {
      return next(
        new AppError(
          STATUS_CODE.BAD_REQUEST,
          STATUS_RESPONSE.FAIL,
          'Invalid email or password'
        )
      );
    }

    // 2. Sign Access and Refresh Tokens
    const { access_token, refresh_token } = await signTokens(user);

    // 3. Add Cookies
    addCookieToResponse(res, access_token, refresh_token);

    // 4. Send response
    res.status(STATUS_CODE.OK).json({
      status: STATUS_RESPONSE.SUCCESS,
      data: { access_token },
    });
  } catch (err: unknown) {
    next(err);
  }
};

export const refreshAccessTokenHandler = async (
  req: Request,
  res: ResponseServer,
  next: NextFunction
) => {
  try {
    const refresh_token = req.cookies.refresh_token;

    const message = 'Could not refresh access token';
    const errorCheckRefreshToken = new AppError(
      STATUS_CODE.FORBIDDEN,
      STATUS_RESPONSE.FAIL,
      message
    );

    if (!refresh_token) {
      return next(errorCheckRefreshToken);
    }

    // Validate refresh token
    const decoded = verifyJwt<{ sub: string }>(
      refresh_token,
      NameKeyPublicToken.refreshTokenPublic
    );

    if (!decoded) {
      return next(errorCheckRefreshToken);
    }

    // Check if user has a valid session
    const session = await redisClient.get(decoded.sub);

    if (!session) {
      return next(errorCheckRefreshToken);
    }

    // Check if user still exist
    const user = await findUserById(JSON.parse(session).id);

    if (!user) {
      return next(errorCheckRefreshToken);
    }

    // Sign new access token
    const access_token = signJwt(
      { sub: user.id },
      NameKeyPrivateToken.accessTokenPrivate,
      {
        expiresIn: `${config.get<number>(CONFIG.ACCESS_TOKEN_EXPIRES)}m`,
      }
    );

    // 4. Add Cookies
    updateAccessToken(res, access_token);

    // 5. Send response
    res.status(STATUS_CODE.OK).json({
      status: STATUS_RESPONSE.SUCCESS,
      data: { access_token },
    });
  } catch (err: unknown) {
    next(err);
  }
};

export const logoutHandler = async (
  req: Request,
  res: ResponseServer,
  next: NextFunction
) => {
  try {
    const user = res.locals.user;

    await redisClient.del(user.id);
    logout(res);

    res.status(STATUS_CODE.OK).json({
      status: STATUS_RESPONSE.SUCCESS,
    });
  } catch (err: unknown) {
    next(err);
  }
};
