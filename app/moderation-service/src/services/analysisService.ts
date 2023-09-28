import { HighUrgencyAnalysisPublisher } from '../events/publisher/high-urgency-analysis-publisher';
import { IAnalysisRepository } from '../interfaces/repositories';
import { Analysis, Feedback } from '../interfaces/models';
import { TYPES, container } from '../../inversify.config';
import { ISentimentAnalysisService } from '../interfaces/services';

class AnalysisService {
  static instance: AnalysisService;

  static analysisRepository: IAnalysisRepository<Analysis>;
  static sentimentService: ISentimentAnalysisService;

  constructor() {
    if (AnalysisService.instance) {
      return AnalysisService.instance;
    }

    AnalysisService.analysisRepository = container.get<
      IAnalysisRepository<Analysis>
    >(TYPES.ANALYSIS_REPOSITORY);
    AnalysisService.sentimentService = container.get<ISentimentAnalysisService>(
      TYPES.SENTIMENT_SERVICE
    );
    AnalysisService.instance = this;
  }

  async analyseFeedback(feedback: Feedback) {
    console.log('Attempting to analyse feedback.');
    const data = await AnalysisService.sentimentService.analyse(
      feedback.content
    );

    const analysis = await AnalysisService.analysisRepository.insertOne(
      data.sentiment,
      data.question,
      data.emotion,
      data.flagged,
      feedback._id
    );

    if (analysis.has_urgency) {
      await new HighUrgencyAnalysisPublisher().publish({
        feedback_id: feedback._id,
        event_id: feedback.event_id,
        campaign_id: feedback.campaign_id,
        message_id: feedback.message_id,
      });
    }
  }

  async retrieveByFeedbackId(feedbackId: string): Promise<Analysis | null> {
    try {
      const analysis = await AnalysisService.analysisRepository.getByFeedbackId(
        feedbackId
      );
      return analysis;
    } catch (err) {
      throw err;
    }
  }
}

const analysisService = new AnalysisService();
export default analysisService;
