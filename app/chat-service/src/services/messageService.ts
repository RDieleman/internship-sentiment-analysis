import { TYPES, container } from '../../inversify.config';
import { Message, CustomMessage } from '../interfaces/models';
import { IRepository } from '../interfaces/repositories';
import { ChatCreatedPublisher } from '../events/publishers/chat-created-publisher';
import { ChatReceivedMessage } from '../events/messages';

class MessageService {
  static instance: MessageService;
  static messageRepository: IRepository<Message>;

  constructor() {
    if (MessageService.instance) {
      return MessageService.instance;
    }

    MessageService.messageRepository = container.get<IRepository<Message>>(
      TYPES.MESSAGE_REPOSITORY
    );
    MessageService.instance = this;
  }

  async handleNewChat(data: ChatReceivedMessage['data']): Promise<Message> {
    try {
      const message = await MessageService.messageRepository.insertOne(
        null,
        data.campaign_id,
        data.event_id,
        data.feedback_id,
        data.content,
        new Date(),
        data.is_ref,
        data.ref_type,
        data.ref_id
      );

      await new ChatCreatedPublisher().publish({
        _id: message._id,
        campaign_id: data.campaign_id,
        content: message.content,
        event_id: message.event_id,
        creation_date: message.creation_date,
        feedback_id: message.feedback_id,
        is_ref: message.is_ref,
        ref_type: message.ref_type,
        ref_id: message.ref_id,
      });

      return message;
    } catch (err) {
      throw err;
    }
  }

  async retrieve(
    campaignId: string,
    eventId: string | null,
    feedbackId: string | null
  ) {
    let messages = [];
    if (eventId == null) {
      messages = await MessageService.messageRepository.getByCampaignId(
        campaignId
      );
    } else if (feedbackId == null) {
      messages = await MessageService.messageRepository.getByEventId(
        campaignId,
        eventId
      );
    } else {
      messages = await MessageService.messageRepository.getByFeedbackId(
        campaignId,
        eventId,
        feedbackId
      );
    }

    return messages;
  }

  async handleBatchImport(messages: CustomMessage[]) {
    const promises = messages.map(async (m) => {
      const message = {
        _id: m.ChatMessageId,
        content: m.Text,
        creation_date: m.SentDateTime,
        event_id: m.TimelineEventId,
        campaign_id: m.CampaignId,
      };

      const existingMessage = await MessageService.messageRepository.getById(
        message._id
      );
      if (existingMessage != null) {
        return;
      }

      const newMessage = await MessageService.messageRepository.insertOne(
        message._id,
        message.campaign_id,
        message.event_id,
        null,
        message.content,
        message.creation_date,
        false,
        null,
        null
      );

      await new ChatCreatedPublisher().publish({
        _id: newMessage._id,
        campaign_id: message.campaign_id,
        content: newMessage.content,
        event_id: newMessage.event_id,
        creation_date: newMessage.creation_date,
        feedback_id: newMessage.feedback_id,
        is_ref: false,
        ref_type: null,
        ref_id: null,
      });
    });

    await Promise.all(promises);
  }
}

const messageService = new MessageService();
export default messageService;
