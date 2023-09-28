import { IMessagePublisher } from '@rdieleman/messaging';
import { SocketNotificationMessage } from '../messages';
import { Subjects } from '../subjects';

export class SocketNotificationPublisher extends IMessagePublisher<SocketNotificationMessage> {
  readonly subject = Subjects.SOCKET_NOTIFICATION;
}
