import { BadRequestError } from '../../errors/badRequestError';
import { IMessageListener } from '@rdieleman/messaging';
import messageService from '../../services/messageService';
import { ChatReceivedMessage } from '../messages';
import { Subjects } from '../subjects';

export class ChatReceivedListener extends IMessageListener<ChatReceivedMessage> {
  readonly subject: Subjects.CHAT_RECEIVED = Subjects.CHAT_RECEIVED;

  async onMessage(data) {
    try {
      if (!data.content || !data.event_id || !data.campaign_id) {
        throw new BadRequestError('Invalid chat message format.');
      }

      if (
        typeof data.content !== 'string' ||
        data.content.trim() === '' ||
        data.content.length > 300
      ) {
        throw new BadRequestError(
          'The message property is not a valid string or longer than 300 characters.'
        );
      }

      await messageService.handleNewChat({
        ...data,
      });
    } catch (err) {
      if (err instanceof BadRequestError) {
        console.log('Caught bad request.', err);
      }

      throw err;
    }
  }
}
