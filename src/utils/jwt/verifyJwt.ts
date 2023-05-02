import jwt from 'jsonwebtoken';
import { NameKeyPublicToken } from './types';
import { getTokenFromEnv } from './helpers';

export const verifyJwt = <T>(
  token: string,
  keyName: NameKeyPublicToken
): T | null => {
  try {
    const publicKey = getTokenFromEnv(keyName);

    const decoded = jwt.verify(token, publicKey) as T;

    return decoded;
  } catch (error) {
    return null;
  }
};
