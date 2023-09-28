import feedbackService from '../../services/feedbackService';
import { IMessageListener } from '@rdieleman/messaging';
import { ChatCreatedMessage } from '../messages';
import { Subjects } from '../subjects';

export class ChatCreatedListener extends IMessageListener<ChatCreatedMessage> {
  readonly subject = Subjects.CHAT_CREATED;

  async onMessage(data: ChatCreatedMessage['data']) {
    console.log('Received new message.');

    if (
      data.feedback_id != null ||
      data.event_id == null ||
      data.is_ref == true
    ) {
      return;
    }

    await feedbackService.createFeedback(
      data._id,
      data.event_id,
      data.campaign_id,
      data.content,
      data.creation_date
    );
  }
}
