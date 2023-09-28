// eventService.js
import { TYPES, container } from '../../inversify.config';
import { IEventRepository, IRepository } from '../interfaces/repositories';
import { Campaign, Event } from '../interfaces/models';
import { BadRequestError } from '../errors/badRequestError';

class EventService {
  static instance: EventService;
  static eventRepsitory: IEventRepository;
  static campaignRepository: IRepository<Campaign>;

  constructor() {
    if (EventService.instance) {
      return EventService.instance;
    }
    EventService.campaignRepository = container.get<IRepository<Campaign>>(
      TYPES.CAMPAIGN_REPOSITORY
    );
    EventService.eventRepsitory = container.get<IEventRepository>(
      TYPES.EVENT_REPOSITORY
    );
    EventService.instance = this;
  }

  async retrieveByCampaignId(campaignId): Promise<Array<Event>> {
    try {
      const events = await EventService.eventRepsitory.getByCampaignId(
        campaignId
      );
      return events;
    } catch (error) {
      throw error;
    }
  }

  async retrieveById(eventId): Promise<Event> {
    try {
      const event = await EventService.eventRepsitory.getById(eventId);
      return event;
    } catch (error) {
      throw error;
    }
  }

  private async generateEvent(
    eventId: string,
    campaignId: string
  ): Promise<Event> {
    return await EventService.eventRepsitory.createOne(
      eventId,
      '/stock-1.png',
      new Date(),
      'This is a test description for a timeline event. This does not contain any real data.',
      'learn',
      campaignId
    );
  }

  async importCustomEvent(eventId: string, campaignId: string): Promise<void> {
    let campaign = await EventService.campaignRepository.getById(campaignId);
    const campaignDoesNotExist = campaign == null;
    if (campaignDoesNotExist) {
      throw new BadRequestError('Campaign does not exist');
    }

    let event = await EventService.eventRepsitory.getById(eventId);
    const eventExists = event != null;
    if (eventExists) {
      return;
    }

    await this.generateEvent(eventId, campaignId);
  }
}

const eventService = new EventService();
export default eventService;
