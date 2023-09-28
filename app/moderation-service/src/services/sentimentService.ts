import { injectable } from 'inversify';
import { AnalysisResponse } from '../interfaces/models';
import { ISentimentAnalysisService } from '../interfaces/services';
import axios from 'axios';

@injectable()
export class SentimentService implements ISentimentAnalysisService {
  static instance: SentimentService;

  constructor() {
    if (SentimentService.instance) {
      return SentimentService.instance;
    }

    SentimentService.instance = this;
  }

  async analyse(text: string): Promise<AnalysisResponse> {
    const options = {
      url: `${process.env.SENTIMENT_AI_URL}/api/all`,
      method: 'POST',
      data: {
        sentence: text,
      },
      headers: { 'Content-Type': 'application/json' },
    };

    const response = await axios(options);

    if (response.status !== 200) {
      throw new Error('Unexpected error connecting to sentiment API');
    }

    const data: AnalysisResponse = response.data;

    return data;
  }
}
