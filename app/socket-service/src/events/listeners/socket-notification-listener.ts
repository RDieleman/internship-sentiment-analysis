import { Types } from '../../models/types';
import interactionService from '../../services/interaction-service';
import { IMessageListener } from '@rdieleman/messaging';
import { SocketNotificationMessage } from '../messages';
import { Subjects } from '../subjects';

export class SocketNotificationListener extends IMessageListener<SocketNotificationMessage> {
  subject: Subjects.SOCKET_NOTIFICATION = Subjects.SOCKET_NOTIFICATION;

  async onMessage(data: any) {
    interactionService.sendToAll(Types.SOCKET_NOTIFICATION, data);
  }
}
