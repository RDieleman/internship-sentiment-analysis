interface IRepository<Message> {
  getAll(): Promise<Message[]>;
  getById(id: string): Promise<Message | null>;
  insertMany(entities: Message[]): Promise<void>;
  getByCampaignId(campaignId: string): Promise<Message[]>;
  getByEventId(campaignId: string, eventId: string): Promise<Message[]>;
  getByFeedbackId(
    campaignId: string,
    eventId: string,
    feedbackId: string
  ): Promise<Message[]>;
  insertOne(
    id: string | null,
    campaign_id: string,
    event_id: string | null,
    feedback_id: string | null,
    content: string,
    creation_date: Date,
    is_ref: boolean,
    ref_type: string | null,
    ref_id: string | null
  ): Promise<Message>;
}

export { IRepository };
