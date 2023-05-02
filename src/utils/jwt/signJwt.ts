import jwt, { SignOptions } from 'jsonwebtoken';
import { NameKeyPrivateToken } from './types';
import { getTokenFromEnv } from './helpers';

export const signJwt = (
  payload: Object,
  keyName: NameKeyPrivateToken,
  options: SignOptions
) => {
  const privateKey = getTokenFromEnv(keyName);

  return jwt.sign(payload, privateKey, {
    ...(options && options),
    algorithm: 'RS256',
  });
};
