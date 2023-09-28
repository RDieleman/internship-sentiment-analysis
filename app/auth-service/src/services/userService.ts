import { TYPES, container } from '../../inversify.config';
import { BadRequestError } from '../errors/badRequestError';
import { User, UserInfo } from '../interfaces/models';
import { IUserRepository } from '../interfaces/repositories';
import passwordService from './passwordService';

class UserService {
  static instance: UserService;
  static userRepository: IUserRepository;

  constructor() {
    if (UserService.instance) {
      return UserService.instance;
    }
    UserService.userRepository = container.get<IUserRepository>(
      TYPES.USER_REPOSITORY
    );

    UserService.instance = this;
  }

  async deleteUser(id: string): Promise<void> {
    const success = await UserService.userRepository.deleteById(id);
    if (success == false) {
      throw Error('Deletion of user failed.');
    }
  }

  async createUser(username: string, password: string): Promise<User> {
    passwordService.validatePotentialPassword(password);

    const existingUser = await UserService.userRepository.getByUsername(
      username
    );
    if (existingUser != null) {
      throw new BadRequestError('Username already exists.');
    }

    const passwordHash = await passwordService.toHash(password);

    const user = await UserService.userRepository.createOne(
      username,
      passwordHash
    );
    return user;
  }

  async getAllUsers(): Promise<Array<UserInfo>> {
    const usersWithPassword = await UserService.userRepository.getAll();
    const formattedUsers: Array<UserInfo> = usersWithPassword.map((user) => {
      const userInfo: UserInfo = {
        _id: user._id,
        username: user.username,
      };

      return userInfo;
    });

    return formattedUsers;
  }
}

const userService = new UserService();
export default userService;
