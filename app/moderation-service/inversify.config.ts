import { Container } from 'inversify';
import {
  IAnalysisRepository,
  IFeedbackRepository,
} from './src/interfaces/repositories';
import { Analysis, Feedback } from './src/interfaces/models';
import MongoFeedbackRepository from './src/repositories/feedbackRepository';
import MongoAnalysisRepository from './src/repositories/analysisRepository';
import { ISentimentAnalysisService } from './src/interfaces/services';
import { SentimentService } from './src/services/sentimentService';

const TYPES = {
  FEEDBACK_REPOSITORY: 'IFeedbackRepository<Feedback>',
  ANALYSIS_REPOSITORY: 'IAnalysisRepository<Analysis>',
  SENTIMENT_SERVICE: 'ISentimentAnalysisService',
};

const container = new Container();

container
  .bind<IFeedbackRepository<Feedback>>(TYPES.FEEDBACK_REPOSITORY)
  .to(MongoFeedbackRepository)
  .inSingletonScope();

container
  .bind<IAnalysisRepository<Analysis>>(TYPES.ANALYSIS_REPOSITORY)
  .to(MongoAnalysisRepository)
  .inSingletonScope();

container
  .bind<ISentimentAnalysisService>(TYPES.SENTIMENT_SERVICE)
  .to(SentimentService)
  .inSingletonScope();

export { container, TYPES };
