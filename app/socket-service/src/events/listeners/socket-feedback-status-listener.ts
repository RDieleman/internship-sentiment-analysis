import { Types } from '../../models/types';
import interactionService from '../../services/interaction-service';
import { IMessageListener } from '@rdieleman/messaging';
import { SocketFeedbackStatusMessage } from '../messages';
import { Subjects } from '../subjects';

export class SocketFeedbackStatusListener extends IMessageListener<SocketFeedbackStatusMessage> {
  subject: Subjects.SOCKET_FEEDBACK_STATUS_CHANGED =
    Subjects.SOCKET_FEEDBACK_STATUS_CHANGED;

  async onMessage(data: SocketFeedbackStatusMessage['data']) {
    interactionService.sendToAll(Types.SOCKET_FEEDBACK_STATUS, data);
  }
}
