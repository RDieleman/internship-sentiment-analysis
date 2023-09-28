import { IMessagePublisher } from '@rdieleman/messaging';
import { ChatReceivedMessage } from '../messages';
import { Subjects } from '../subjects';

export class ChatReceivedPublisher extends IMessagePublisher<ChatReceivedMessage> {
  subject: Subjects = Subjects.CHAT_RECEIVED;

  async publish(message: ChatReceivedMessage['data']): Promise<void> {
    await super.publish(message);
  }
}
