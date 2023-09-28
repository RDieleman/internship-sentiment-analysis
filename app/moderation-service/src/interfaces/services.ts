import { AnalysisResponse } from './models';

interface ISentimentAnalysisService {
  analyse(text: string): Promise<AnalysisResponse>;
}

export { ISentimentAnalysisService };
