import { injectable } from 'inversify';
import { container } from '../inversify.config';

interface IMessage {
  subject: string;
  data: any;
}

interface IMessageService {
  init(
    url: string,
    clusterId: string,
    groupId: string,
    onClose: () => void
  ): Promise<void>;
  subscribe(
    subject: IMessage['subject'],
    callback: (data: IMessage['data']) => Promise<void>
  ): void;
  publish(message: IMessage): Promise<void>;
  close(): void;
}

@injectable()
abstract class IMessageListener<T extends IMessage> {
  abstract readonly subject: T['subject'];

  async listen() {
    const messageService = container.get<IMessageService>('IMessageService');
    await messageService.subscribe(this.subject, this.onMessage);
  }

  abstract onMessage(data: T['data']): Promise<void>;
}

@injectable()
abstract class IMessagePublisher<T extends IMessage> {
  readonly subject!: string;

  async publish(data: T['data']) {
    const messageService = container.get<IMessageService>('IMessageService');
    await messageService.publish({
      subject: this.subject,
      data: data,
    });
  }
}

export { IMessage, IMessageService, IMessageListener, IMessagePublisher };
