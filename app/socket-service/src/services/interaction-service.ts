import { BadRequestError } from '../errors/badRequestError';
import { ChatReceivedPublisher } from '../events/publishers/chat-received-publisher';
import { SocketMessage } from '../interfaces/models';
import { Types } from '../models/types';
import { wsInstance } from '../server';

class InteractionService {
  static instance: InteractionService;

  constructor() {
    if (InteractionService.instance) {
      return InteractionService.instance;
    }

    InteractionService.instance = this;
  }

  async handleIncommingMessage(message: SocketMessage): Promise<void> {
    let data;
    try {
      data = JSON.parse(message.dataString);
    } catch (err) {
      throw new BadRequestError('Invalid JSON format.');
    }

    const isValidFormat = data.type && data.content;
    if (!isValidFormat) {
      throw new BadRequestError('Invalid socket data format.');
    }

    const typeIsValid = Object.values(Types).includes(data.type);
    if (!typeIsValid) {
      throw new BadRequestError('Invalid data type.');
    }

    let publisher;

    switch (data.type) {
      case Types.CHAT_SEND:
        publisher = ChatReceivedPublisher;
        break;

      default:
        throw new BadRequestError('Unexpected data type.');
    }

    await new publisher().publish(data.content);
  }

  async sendToAll(type, content): Promise<void> {
    wsInstance.getWss().clients.forEach((client) => {
      try {
        client.send(
          JSON.stringify({
            type,
            content,
          })
        );
      } catch (err) {
        console.error('Failed to send chat message to client: ', err);
      }
    });
  }
}

const interactionService = new InteractionService();
export default interactionService;
