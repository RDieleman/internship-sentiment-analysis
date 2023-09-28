import notificationService from '../../services/notificationService';
import { TriggerTypes } from '../../models/triggerTypes';
import { IMessageListener } from '@rdieleman/messaging';
import { HighUrgencyAnalysisMessage } from '../messages';
import { Subjects } from '../subjects';

export class HighUrgencyAnalysisListener extends IMessageListener<HighUrgencyAnalysisMessage> {
  subject: Subjects.ANALYSIS_HIGH_URGENCY = Subjects.ANALYSIS_HIGH_URGENCY;

  async onMessage(data: HighUrgencyAnalysisMessage['data']) {
    await notificationService.handleTrigger(
      TriggerTypes.HIGH_URGENCY_FEEDBACK,
      data
    );
  }
}
