import { Container } from 'inversify';
import { IRepository } from './src/interfaces/repositories';
import { Message } from './src/interfaces/models';
import MongoMessageRepository from './src/repositories/messageRepository';

const TYPES = {
  MESSAGE_REPOSITORY: 'IRepository<Message>',
};

const container = new Container();

container
  .bind<IRepository<Message>>(TYPES.MESSAGE_REPOSITORY)
  .to(MongoMessageRepository)
  .inSingletonScope();

export { container, TYPES };
