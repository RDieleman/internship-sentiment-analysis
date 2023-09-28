import analysisService from './analysisService';
import { FeedbackStatusChangedPublisher } from '../events/publisher/feedback-status-change-publisher';
import { IFeedbackRepository } from '../interfaces/repositories';
import { Feedback } from '../interfaces/models';
import { TYPES, container } from '../../inversify.config';

export interface FeedbackStatus {
  isProcessed: boolean;
  isAssigned: boolean;
}

class FeedbackService {
  static instance: FeedbackService;
  static feedbackRepository: IFeedbackRepository<Feedback>;

  constructor() {
    if (FeedbackService.instance) {
      return FeedbackService.instance;
    }
    FeedbackService.feedbackRepository = container.get<
      IFeedbackRepository<Feedback>
    >(TYPES.FEEDBACK_REPOSITORY);
    FeedbackService.instance = this;
  }

  async createFeedback(
    messageId: string,
    eventId: string,
    campaignId: string,
    content: string,
    creation_date: Date
  ) {
    let feedback;
    try {
      feedback = await FeedbackService.feedbackRepository.insertOne(
        content,
        false,
        false,
        messageId,
        campaignId,
        eventId,
        creation_date
      );
    } catch (err) {
      console.error('Failed to store new feedback.');
      throw err;
    }

    try {
      await analysisService.analyseFeedback(feedback);
    } catch (err) {
      await FeedbackService.feedbackRepository.deleteById(feedback._id);
      throw err;
    }
  }

  async getAnalysisDataForFeedback(feedback: Feedback) {
    const analysis = await analysisService.retrieveByFeedbackId(feedback._id!);

    return {
      analysis,
      ...feedback,
    };
  }

  async retrieveAll() {
    try {
      const feedbackItems = await FeedbackService.feedbackRepository.getAll();
      const promises = feedbackItems.map((item) => {
        return new Promise((resolve) =>
          resolve(this.getAnalysisDataForFeedback(item))
        );
      });

      const itemsWithAnalysis = await Promise.all(promises).then((res) => {
        return res;
      });

      return itemsWithAnalysis;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async retrieveByCampaignId(campaignId: string) {
    try {
      const feedbackItems =
        await FeedbackService.feedbackRepository.getByCampaignId(campaignId);
      const promises = feedbackItems.map((item) => {
        return new Promise((resolve) =>
          resolve(this.getAnalysisDataForFeedback(item))
        );
      });
      const itemsWithAnalysis = await Promise.all(promises).then((res) => {
        return res;
      });

      return itemsWithAnalysis;
    } catch (error) {
      throw error;
    }
  }

  async updateStatus(feedbackId: string, options: FeedbackStatus) {
    try {
      const feedback = await FeedbackService.feedbackRepository.getById(
        feedbackId
      );

      await FeedbackService.feedbackRepository.updateOne({
        ...feedback,
        is_processed: options.isProcessed,
        is_assigned: options.isAssigned,
      });
    } catch (error) {
      throw error;
    }

    new FeedbackStatusChangedPublisher().publish({
      feedback_id: feedbackId,
      is_processed: options.isProcessed,
      is_assigned: options.isAssigned,
    });
  }
}

const feedbackService = new FeedbackService();
export default feedbackService;
