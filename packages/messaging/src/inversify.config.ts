import { Container } from 'inversify';
import NatsWrapper from './implementations/nats-wrapper';
import { IMessageService } from './core';

const container = new Container();
container
  .bind<IMessageService>('IMessageService')
  .to(NatsWrapper)
  .inSingletonScope();

export { container };
