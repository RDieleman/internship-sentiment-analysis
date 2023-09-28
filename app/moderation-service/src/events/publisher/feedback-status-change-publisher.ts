import { IMessagePublisher } from '@rdieleman/messaging';
import { SocketFeedbackStatusMessage } from '../messages';
import { Subjects } from '../subjects';

export class FeedbackStatusChangedPublisher extends IMessagePublisher<SocketFeedbackStatusMessage> {
  readonly subject = Subjects.SOCKET_FEEDBACK_STATUS_CHANGED;
}
