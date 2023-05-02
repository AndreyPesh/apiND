import config from 'config';
import { CookieOptions } from 'express';
import { CONFIG } from '../env/enums';

const cookiesOptions: CookieOptions = {
  httpOnly: true,
  sameSite: 'lax',
};

if (process.env.NODE_ENV === 'production') cookiesOptions.secure = true;

export const accessTokenCookieOptions: CookieOptions = {
  ...cookiesOptions,
  expires: new Date(
    Date.now() + config.get<number>(CONFIG.ACCESS_TOKEN_EXPIRES) * 60 * 1000
  ),
  maxAge: config.get<number>(CONFIG.ACCESS_TOKEN_EXPIRES) * 60 * 1000,
};

export const refreshTokenCookieOptions: CookieOptions = {
  ...cookiesOptions,
  expires: new Date(
    Date.now() + config.get<number>(CONFIG.REFRESH_TOKEN_EXPIRES) * 60 * 1000
  ),
  maxAge: config.get<number>(CONFIG.REFRESH_TOKEN_EXPIRES) * 60 * 1000,
};
