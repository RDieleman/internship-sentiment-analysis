import { Container } from 'inversify';
import { IEventRepository, IRepository } from './src/interfaces/repositories';
import { Campaign } from './src/interfaces/models';
import MongoCampaignRepository from './src/repositories/campaignRepository';
import MongoEventRepository from './src/repositories/eventRepository';

const TYPES = {
  CAMPAIGN_REPOSITORY: 'IRepository<Campaign>',
  EVENT_REPOSITORY: 'IEventRepository',
};

const container = new Container();

container
  .bind<IRepository<Campaign>>(TYPES.CAMPAIGN_REPOSITORY)
  .to(MongoCampaignRepository)
  .inSingletonScope();

container
  .bind<IEventRepository>(TYPES.EVENT_REPOSITORY)
  .to(MongoEventRepository)
  .inSingletonScope();

export { container, TYPES };
