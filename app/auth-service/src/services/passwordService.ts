import { randomBytes, scrypt } from 'crypto';
import { promisify } from 'util';
import {
  PasswordCriterion,
  PasswordValidationError,
} from '../errors/passwordValidationError';
import commonPasswordsData from '../data/10-million-password-list-top-1000000.json';

const scryptAsync = promisify(scrypt);

class PasswordService {
  static instance: PasswordService;
  weakPasswords: Set<string>;

  constructor() {
    if (PasswordService.instance) {
      return PasswordService.instance;
    }

    this.weakPasswords = new Set();

    //@ts-ignore
    commonPasswordsData.forEach((entry) => {
      this.weakPasswords.add(entry);
    });

    PasswordService.instance = this;
  }
  async toHash(password: string) {
    const salt = randomBytes(8).toString('hex');
    const buffer = (await scryptAsync(password, salt, 64)) as Buffer;

    return `${buffer.toString('hex')}.${salt}`;
  }

  validatePotentialPassword(potentialPassword: string) {
    const errors: PasswordCriterion[] = [];

    if (!potentialPassword) {
      errors.push({
        key: 'NotEmpty',
        message: "Password can't be empty or undefined.",
      });
    }

    if (potentialPassword.length < 8) {
      errors.push({
        key: 'Length',
        message: 'Password must be at least 8 characters long.',
      });
    }

    if (this.weakPasswords.has(potentialPassword)) {
      errors.push({
        key: 'Weak',
        message: 'Password is a common, weak password.',
      });
    }

    if (errors.length > 0) {
      throw new PasswordValidationError(errors);
    }
  }

  async equals(storedPassword: string, suppliedPassword: string) {
    const [hashedPassword, salt] = storedPassword.split('.');
    const buffer = (await scryptAsync(suppliedPassword, salt, 64)) as Buffer;

    return buffer.toString('hex') === hashedPassword;
  }
}

const passwordService = new PasswordService();
export default passwordService;
