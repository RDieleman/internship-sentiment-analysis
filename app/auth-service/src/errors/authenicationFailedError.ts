import { CustomError } from './customError';

export class AuthenticationFailedError extends CustomError {
  statusCode = 401;

  constructor() {
    super('Unauthorized.');

    Object.setPrototypeOf(this, AuthenticationFailedError.prototype);
  }

  serializeErrors() {
    return [];
  }
}
