import { BadRequestError } from '../errors/badRequestError';
import { SocketNotificationMessage } from '../events/messages';
import { SocketNotificationPublisher } from '../events/publishers/socket-notification-publisher';

import { TriggerTypes } from '../models/triggerTypes';

class NotificationService {
  static instance: NotificationService;

  constructor() {
    if (NotificationService.instance) {
      return NotificationService.instance;
    }
    NotificationService.instance = this;
  }

  async sendNotification(data: SocketNotificationMessage['data']) {
    await new SocketNotificationPublisher().publish(data);
  }

  async handleTrigger(type, data) {
    try {
      let notificationData: SocketNotificationMessage['data'];
      switch (type) {
        case TriggerTypes.HIGH_URGENCY_FEEDBACK:
          notificationData = {
            content: `New high-urgency feedback has been posted.`,
            campaign_id: data.campaign_id,
            event_id: data.event_id,
            feedback_id: data.feedback_id,
          };
          break;
        default:
          throw new BadRequestError('Invalid notification trigger provided.');
      }
      await this.sendNotification(notificationData);
    } catch (err) {
      throw new BadRequestError('Invalid notification data format provided.');
    }
  }
}

const notificationService = new NotificationService();
export default notificationService;
