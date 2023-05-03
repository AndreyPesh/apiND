import { Response } from 'express';
import { STATUS_RESPONSE } from './enums';

export type ResponseServer = Response<{
  status: STATUS_RESPONSE;
  message: string;
  data?: unknown;
}>;
