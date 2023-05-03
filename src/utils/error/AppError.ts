import { STATUS_CODE, STATUS_RESPONSE } from '../../types/enums';

export default class AppError extends Error {
  public status: STATUS_RESPONSE;
  public statusCode: STATUS_CODE;
  public message: string;
  public isOperational: boolean;
  constructor(statusCode = STATUS_CODE.INTERNAL_ERROR, status: STATUS_RESPONSE, message = '') {
    super(message);
    this.statusCode = statusCode;
    this.status = status;
    this.message = message;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}
