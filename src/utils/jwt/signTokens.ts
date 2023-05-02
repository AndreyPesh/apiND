import config from 'config';
import { User } from '../../entities/user.entity';
import redisClient from '../redis/connectRedis';
import { signJwt } from './signJwt';
import { NameKeyPrivateToken } from './types';
import { CONFIG } from '../env/enums';

export const signTokens = async (user: User) => {
  // 1. Create Session
  redisClient.set(user.id, JSON.stringify(user), {
    EX: config.get<number>(CONFIG.REDIS_EXPIRES) * 60,
  });

  // 2. Create Access and Refresh tokens
  const access_token = signJwt(
    { sub: user.id },
    NameKeyPrivateToken.accessTokenPrivate,
    {
      expiresIn: `${config.get<number>(CONFIG.ACCESS_TOKEN_EXPIRES)}m`,
    }
  );

  const refresh_token = signJwt(
    { sub: user.id },
    NameKeyPrivateToken.refreshTokenPrivate,
    {
      expiresIn: `${config.get<number>(CONFIG.REFRESH_TOKEN_EXPIRES)}m`,
    }
  );

  return { access_token, refresh_token };
};
