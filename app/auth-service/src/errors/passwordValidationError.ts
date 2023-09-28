import { CustomError } from './customError';

interface PasswordCriterion {
  key: string;
  message: string;
}

class PasswordValidationError extends CustomError {
  statusCode = 400;

  constructor(public errors: PasswordCriterion[]) {
    super('Invalid request parameters.');

    Object.setPrototypeOf(this, PasswordValidationError.prototype);
  }

  serializeErrors() {
    return this.errors.map((err) => {
      return { message: err.message };
    });
  }
}

export { PasswordValidationError, PasswordCriterion };
