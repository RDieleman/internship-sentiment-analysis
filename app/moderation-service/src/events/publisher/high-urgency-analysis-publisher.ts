import { IMessagePublisher } from '@rdieleman/messaging';
import { HighUrgencyAnalysisMessage } from '../messages';
import { Subjects } from '../subjects';

export class HighUrgencyAnalysisPublisher extends IMessagePublisher<HighUrgencyAnalysisMessage> {
  readonly subject = Subjects.ANALYSIS_HIGH_URGENCY;
}
