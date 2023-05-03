import { ResponseServer } from '../../types/types';
import { accessTokenCookieOptions, refreshTokenCookieOptions } from './cookies';
import { NAME_COOKIE } from './enums';

export const logout = (res: ResponseServer) => {
  res.cookie(NAME_COOKIE.ACCESS, '', { maxAge: -1 });
  res.cookie(NAME_COOKIE.REFRESH, '', { maxAge: -1 });
  res.cookie(NAME_COOKIE.LOGGED, '', { maxAge: -1 });
};

export const addCookieToResponse = (
  res: ResponseServer,
  access_token: string,
  refresh_token: string
) => {
  res.cookie(NAME_COOKIE.ACCESS, access_token, accessTokenCookieOptions);
  res.cookie(NAME_COOKIE.REFRESH, refresh_token, refreshTokenCookieOptions);
  res.cookie(NAME_COOKIE.LOGGED, true, {
    ...accessTokenCookieOptions,
    httpOnly: false,
  });
};

export const updateAccessToken = (
  res: ResponseServer,
  access_token: string
) => {
  res.cookie(NAME_COOKIE.ACCESS, access_token, accessTokenCookieOptions);
  res.cookie(NAME_COOKIE.LOGGED, true, {
    ...accessTokenCookieOptions,
    httpOnly: false,
  });
};
