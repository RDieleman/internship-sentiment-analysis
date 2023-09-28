import { injectable } from 'inversify';
import { Message } from '../interfaces/models';
import { IRepository } from '../interfaces/repositories';
import { IMessageDoc, MessageModel } from '../models/message';
import { randomUUID } from 'crypto';

@injectable()
export default class MongoMessageRepository implements IRepository<Message> {
  private docToEntity(doc: IMessageDoc): Message {
    return {
      _id: doc._id,
      content: doc.content,
      creation_date: new Date(doc.creation_date),
      feedback_id: doc.feedback_id,
      event_id: doc.event_id,
      campaign_id: doc.campaign_id,
      is_ref: doc.is_ref,
      ref_type: doc.ref_type,
      ref_id: doc.ref_id,
    };
  }

  private entityToDoc(entity: Message): IMessageDoc {
    const doc: IMessageDoc = new MessageModel({
      _id: entity._id,
      content: entity.content,
      creation_date: new Date(entity.creation_date),
      feedback_id: entity.feedback_id,
      event_id: entity.event_id,
      campaign_id: entity.campaign_id,
      is_ref: entity.is_ref,
      ref_type: entity.ref_type,
      ref_id: entity.ref_id,
    });

    return doc;
  }

  async getAll(): Promise<Message[]> {
    const docs = await MessageModel.find({}).exec();

    const messages: Message[] = docs.map((doc) => {
      return this.docToEntity(doc);
    });

    return messages;
  }

  async getByCampaignId(campaignId: string): Promise<Message[]> {
    const docs = await MessageModel.find({
      campaign_id: campaignId,
      event_id: null,
      feedback_id: null,
    }).exec();

    const messages: Message[] = docs.map((doc) => {
      return this.docToEntity(doc);
    });

    return messages;
  }
  async getByFeedbackId(
    campaignId: string,
    eventId: string,
    feedbackId: string
  ): Promise<Message[]> {
    const docs = await MessageModel.find({
      campaign_id: campaignId,
      event_id: eventId,
      feedback_id: feedbackId,
    }).exec();

    const messages: Message[] = docs.map((doc) => {
      return this.docToEntity(doc);
    });

    return messages;
  }

  async getByEventId(campaignId: string, eventId: string): Promise<Message[]> {
    const docs = await MessageModel.find({
      campaign_id: campaignId,
      event_id: eventId,
      feedback_id: null,
    }).exec();

    const messages: Message[] = docs.map((doc) => {
      return this.docToEntity(doc);
    });

    return messages;
  }

  async getById(id: string): Promise<Message> {
    const doc = await MessageModel.findById(id).exec();
    if (doc == null) {
      return null;
    }

    return this.docToEntity(doc);
  }

  async insertMany(entities: Message[]): Promise<void> {
    const formateddEntities = entities.map((entity) => {
      const formattedEntity = {
        ...entity,
        event_id: entity.event_id,
      };

      delete formattedEntity._id;

      return formattedEntity;
    });

    //@ts-ignore
    await MessageModel.collection.insertMany(formateddEntities);
    return;
  }

  async insertOne(
    id: string | null,
    campaign_id: string,
    event_id: string | null,
    feedback_id: string | null,
    content: string,
    creation_date: Date,
    is_ref: boolean,
    ref_type: string | null,
    ref_id: string | null
  ): Promise<Message> {
    const messageId = id != null ? id : randomUUID();
    const doc = new MessageModel({
      _id: messageId,
      campaign_id,
      event_id,
      feedback_id,
      content,
      creation_date,
      is_ref,
      ref_type,
      ref_id,
    });

    await doc.save();

    return this.docToEntity(doc);
  }
}
