import { injectable } from 'inversify';
import { Event } from '../interfaces/models';
import { IEventRepository } from '../interfaces/repositories';
import { EventModel, IEventDoc } from '../models/event';
import { randomUUID } from 'crypto';

@injectable()
export default class MongoEventRepository implements IEventRepository {
  private docToEntity(doc: IEventDoc): Event {
    return {
      _id: doc._id,
      image_url: doc.image_url,
      post_date: new Date(doc.post_date),
      description: doc.description,
      type: doc.type,
      campaign_id: doc.campaign_id,
    };
  }

  private entityToDoc(entity: Event): IEventDoc {
    const doc: IEventDoc = new EventModel({
      _id: entity._id,
      image_url: entity.image_url,
      post_date: entity.post_date,
      description: entity.description,
      type: entity.type,
      campaign_id: entity.campaign_id,
    });

    return doc;
  }

  async getAll(): Promise<Event[]> {
    const docs = await EventModel.find({}).exec();

    const events: Event[] = docs.map((doc) => {
      return this.docToEntity(doc);
    });

    return events;
  }

  async getById(id: string): Promise<Event> {
    const doc = await EventModel.findById(id).exec();
    if (doc == null) {
      return null;
    }

    return this.docToEntity(doc);
  }

  async getByCampaignId(id: string): Promise<Event[]> {
    const docs = await EventModel.find({ campaign_id: id }).exec();

    return docs.map((doc) => {
      return this.docToEntity(doc);
    });
  }

  async insertMany(entities: Event[]): Promise<void> {
    const docs = entities.map((entity) => {
      return this.entityToDoc(entity);
    });

    await EventModel.collection.insertMany(docs);
    return;
  }

  async createOne(
    id: string,
    image_url: string,
    post_date: Date,
    description: string,
    type: string,
    campaign_id: string
  ): Promise<Event> {
    const eventId = id != null ? id : randomUUID();

    const entity: Event = {
      _id: eventId,
      image_url,
      post_date,
      description,
      type,
      campaign_id,
    };

    const doc = await this.entityToDoc(entity).save();
    return this.docToEntity(doc);
  }
}
