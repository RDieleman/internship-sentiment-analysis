import { Campaign, Event } from './models';

interface IRepository<T> {
  getAll(participant_id: string): Promise<T[]>;
  getByIdForUser(id: string, participant_id: string): Promise<T | null>;
  getById(id: string): Promise<T | null>;
  insertMany(entities: T[]): Promise<void>;
  createOne(
    id: string | null,
    title: string,
    description: string,
    start_date: Date
  ): Promise<Campaign>;
  updateOne(entity: Campaign): Promise<void>;
}

interface IEventRepository {
  getAll(): Promise<Event[]>;
  getById(id: string): Promise<Event | null>;
  insertMany(entities: Event[]): Promise<void>;
  getByCampaignId(id: string): Promise<Event[]>;
  createOne(
    id: string | null,
    image_url: string,
    post_date: Date,
    description: string,
    type: string,
    campaign_id: string
  ): Promise<Event>;
}

export { IRepository, IEventRepository };
