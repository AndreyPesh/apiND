import config from 'config';
import { NameKeyPrivateToken, NameKeyPublicToken } from './types';

export const getTokenFromEnv = (
  keyName: NameKeyPublicToken | NameKeyPrivateToken
) => {
  const key = Buffer.from(config.get<string>(keyName), 'base64').toString(
    'ascii'
  );
  return key;
};
