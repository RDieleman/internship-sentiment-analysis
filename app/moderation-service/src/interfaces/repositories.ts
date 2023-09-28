interface IAnalysisRepository<Analysis> {
  getById(id: string): Promise<Analysis | null>;
  getByFeedbackId(id: string): Promise<Analysis | null>;
  updateOne(entity: Analysis): Promise<void>;
  insertOne(
    sentiment: string,
    is_question: boolean,
    emotion: string,
    has_urgency: boolean,
    feedback_id: string
  ): Promise<Analysis>;
}

interface IFeedbackRepository<Feedback> {
  getAll(): Promise<Feedback[]>;
  getById(id: string): Promise<Feedback | null>;
  getByCampaignId(id: string): Promise<Feedback[]>;
  updateOne(entity: Feedback): Promise<void>;
  deleteById(id: string): Promise<void>;
  insertOne(
    content: string,
    is_processed: boolean,
    is_assigned: boolean,
    message_id: string,
    campaign_id: string,
    event_id: string,
    creation_date: Date
  ): Promise<Feedback>;
}

export { IAnalysisRepository, IFeedbackRepository };
