import { Container } from 'inversify';
import { IUserRepository } from './src/interfaces/repositories';
import MongoUserRepository from './src/repositories/userRepository';

const TYPES = {
  USER_REPOSITORY: 'IUserRepository',
};

const container = new Container();

container
  .bind<IUserRepository>(TYPES.USER_REPOSITORY)
  .to(MongoUserRepository)
  .inSingletonScope();

export { container, TYPES };
