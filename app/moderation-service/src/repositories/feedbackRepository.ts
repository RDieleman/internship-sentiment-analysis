import { injectable } from 'inversify';
import { Feedback } from '../interfaces/models';
import { IFeedbackRepository } from '../interfaces/repositories';
import { IFeedbackDoc, FeedbackModel } from '../models/feedback';

@injectable()
export default class MongoFeedbackRepository
  implements IFeedbackRepository<Feedback>
{
  private docToEntity(doc: IFeedbackDoc): Feedback {
    return {
      _id: doc._id,
      content: doc.content,
      is_processed: doc.is_processed,
      is_assigned: doc.is_assigned,
      message_id: doc.message_id,
      campaign_id: doc.campaign_id,
      event_id: doc.event_id,
      creation_date: new Date(doc.creation_date),
    };
  }

  private entityToDoc(entity: Feedback): IFeedbackDoc {
    const doc: IFeedbackDoc = new FeedbackModel({
      _id: entity._id,
      content: entity.content,
      is_processed: entity.is_processed,
      is_assigned: entity.is_assigned,
      message_id: entity.message_id,
      campaign_id: entity.campaign_id,
      event_id: entity.event_id,
      creation_date: new Date(entity.creation_date),
    });

    return doc;
  }

  async getAll(): Promise<Feedback[]> {
    const docs = await FeedbackModel.find({}).exec();

    const messages: Feedback[] = docs.map((doc) => {
      return this.docToEntity(doc);
    });

    return messages;
  }

  async getByCampaignId(id: string): Promise<Feedback[]> {
    const docs = await FeedbackModel.find({ campaign_id: id }).exec();

    const messages: Feedback[] = docs.map((doc) => {
      return this.docToEntity(doc);
    });

    return messages;
  }

  async getById(id: string): Promise<Feedback> {
    const doc = await FeedbackModel.findById(id).exec();
    if (doc == null) {
      return null;
    }

    return this.docToEntity(doc);
  }

  async updateOne(entity: Feedback): Promise<void> {
    const doc = this.entityToDoc(entity);

    await FeedbackModel.findByIdAndUpdate(entity._id, doc);
  }

  async insertOne(
    content: string,
    is_processed: boolean,
    is_assigned: boolean,
    message_id: string,
    campaign_id: string,
    event_id: string,
    creation_date: Date
  ): Promise<Feedback> {
    const doc = new FeedbackModel({
      content,
      is_processed,
      is_assigned,
      message_id,
      campaign_id,
      event_id,
      creation_date,
    });

    await doc.save();

    return this.docToEntity(doc);
  }

  async deleteById(id: string): Promise<void> {
    await FeedbackModel.deleteOne({ _id: id }).exec();
  }
}
