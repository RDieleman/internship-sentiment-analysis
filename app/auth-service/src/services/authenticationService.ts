import { TYPES, container } from '../../inversify.config';
import { AuthenticationFailedError } from '../errors/authenicationFailedError';
import { BadRequestError } from '../errors/badRequestError';
import { Session, UserInfo } from '../interfaces/models';
import { IUserRepository } from '../interfaces/repositories';
import passwordService from './passwordService';
import { SessionService } from './sessionService';

class AuthenticationService {
  static instance: AuthenticationService;
  userRepository: IUserRepository;

  constructor() {
    if (AuthenticationService.instance) {
      return AuthenticationService.instance;
    }
    this.userRepository = container.get<IUserRepository>(TYPES.USER_REPOSITORY);

    AuthenticationService.instance = this;
  }

  async login(username: string, password: string): Promise<Session> {
    try {
      const user = await this.userRepository.getByUsername(username);
      if (user == null) {
        throw new BadRequestError('Invalid username provided');
      }

      const isValid = await passwordService.equals(user.passwordHash, password);
      if (isValid == false) {
        throw new BadRequestError('Invalid password provided.');
      }

      const userInfo: UserInfo = {
        _id: user._id,
        username: user.username,
      };

      return SessionService.generateToken(userInfo);
    } catch (err) {
      console.log('Login failed: ', err);

      // Provide genereric response if failed.
      throw new AuthenticationFailedError();
    }
  }
}

const authenticationService = new AuthenticationService();
export default authenticationService;
