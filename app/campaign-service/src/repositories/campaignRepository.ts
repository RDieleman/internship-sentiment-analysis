import { injectable } from 'inversify';
import { Campaign } from '../interfaces/models';
import { IRepository } from '../interfaces/repositories';
import { CampaignModel, ICampaignDoc } from '../models/campaign';
import { randomUUID } from 'crypto';

@injectable()
export default class MongoCampaignRepository implements IRepository<Campaign> {
  private docToEntity(doc: ICampaignDoc): Campaign {
    return {
      _id: doc._id,
      title: doc.title,
      description: doc.description,
      is_archived: doc.is_archived,
      start_date: new Date(doc.start_date),
      participant_ids: doc.participant_ids,
    };
  }

  private entityToDoc(entity: Campaign): ICampaignDoc {
    const doc: ICampaignDoc = new CampaignModel({
      _id: entity._id,
      title: entity.title,
      description: entity.description,
      is_archived: entity.is_archived,
      start_date: entity.start_date,
      participant_ids: entity.participant_ids,
    });

    return doc;
  }

  async createOne(
    id: string,
    title: string,
    description: string,
    start_date: Date
  ): Promise<Campaign> {
    const campaignId = id != null ? id : randomUUID();

    const entity: Campaign = {
      _id: campaignId,
      title,
      description,
      start_date,
      is_archived: false,
      participant_ids: [],
    };

    const doc = await this.entityToDoc(entity).save();
    return this.docToEntity(doc);
  }
  async getAll(participant_id: string): Promise<Campaign[]> {
    const docs = await CampaignModel.find({
      participant_ids: participant_id,
    }).exec();

    const campaigns: Campaign[] = docs.map((doc) => {
      return this.docToEntity(doc);
    });

    return campaigns;
  }

  async getByIdForUser(
    id: string,
    participant_id: string
  ): Promise<Campaign | null> {
    const doc = await CampaignModel.findOne({
      _id: id,
      participant_ids: participant_id,
    }).exec();
    if (doc == null) {
      return null;
    }

    return this.docToEntity(doc);
  }

  async getById(id: string): Promise<Campaign | null> {
    const doc = await CampaignModel.findById(id).exec();
    if (doc == null) {
      return null;
    }

    return this.docToEntity(doc);
  }

  async insertMany(entities: Campaign[]): Promise<void> {
    const docs = entities.map((entity) => {
      return this.entityToDoc(entity);
    });

    //@ts-ignore
    await CampaignModel.collection.insertMany(docs);
    return;
  }

  async updateOne(entity: Campaign): Promise<void> {
    const doc = this.entityToDoc(entity);
    await CampaignModel.findByIdAndUpdate(entity._id, doc);
  }
}
