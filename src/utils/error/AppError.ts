import { STATUS_CODE, STATUS_RESPONSE } from '../../types/enums';

export default class AppError extends Error {
  status: STATUS_RESPONSE;
  isOperational: boolean;
  constructor(
    public statusCode: number = STATUS_CODE.INTERNAL_ERROR,
    public message: string
  ) {
    super(message);
    this.status = STATUS_RESPONSE.error;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}
