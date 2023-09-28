import { injectable } from 'inversify';
import { Analysis } from '../interfaces/models';
import { IAnalysisRepository } from '../interfaces/repositories';
import { IAnalysisDoc, AnalysisModel } from '../models/analysis';

@injectable()
export default class MongoAnalysisRepository
  implements IAnalysisRepository<Analysis>
{
  private docToEntity(doc: IAnalysisDoc): Analysis {
    return {
      _id: doc._id,
      sentiment: doc.sentiment,
      is_question: doc.is_question,
      emotion: doc.emotion,
      has_urgency: doc.has_urgency,
      feedback_id: doc.feedback_id,
    };
  }

  private entityToDoc(entity: Analysis): IAnalysisDoc {
    const doc: IAnalysisDoc = new AnalysisModel({
      _id: entity._id,
      sentiment: entity.sentiment,
      is_question: entity.is_question,
      emotion: entity.emotion,
      has_urgency: entity.has_urgency,
      feedback_id: entity.feedback_id,
    });

    return doc;
  }

  async getByFeedbackId(id: string): Promise<Analysis | null> {
    const doc = await AnalysisModel.findOne({ feedback_id: id }).exec();
    if (!doc) {
      return null;
    }

    return this.docToEntity(doc);
  }

  async getById(id: string): Promise<Analysis> {
    const doc = await AnalysisModel.findById(id).exec();
    if (doc == null) {
      return null;
    }

    return this.docToEntity(doc);
  }

  async updateOne(entity: Analysis): Promise<void> {
    const doc = this.entityToDoc(entity);
    await AnalysisModel.findByIdAndUpdate(entity._id, doc);
  }

  async insertOne(
    sentiment: string,
    is_question: boolean,
    emotion: string,
    has_urgency: boolean,
    feedback_id: string
  ): Promise<Analysis> {
    const doc = new AnalysisModel({
      sentiment,
      is_question,
      emotion,
      has_urgency,
      feedback_id,
    });

    await doc.save();

    return this.docToEntity(doc);
  }
}
