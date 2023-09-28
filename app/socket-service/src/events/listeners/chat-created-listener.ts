import { IMessageListener } from '@rdieleman/messaging';
import { Types } from '../../models/types';
import interactionService from '../../services/interaction-service';
import { ChatCreatedMessage } from '../messages';
import { Subjects } from '../subjects';

export class ChatCreatedListener extends IMessageListener<ChatCreatedMessage> {
  subject: Subjects.CHAT_CREATED = Subjects.CHAT_CREATED;

  async onMessage(data: ChatCreatedMessage['data']) {
    interactionService.sendToAll(Types.CHAT_RECEIVE, data);
  }
}
