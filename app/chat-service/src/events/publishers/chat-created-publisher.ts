import { IMessagePublisher } from '@rdieleman/messaging';
import { ChatCreatedMessage } from '../messages';
import { Subjects } from '../subjects';

export class ChatCreatedPublisher extends IMessagePublisher<ChatCreatedMessage> {
  readonly subject: Subjects.CHAT_CREATED = Subjects.CHAT_CREATED;
}
