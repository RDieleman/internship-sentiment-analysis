import { Subjects } from './subjects';

export interface SocketNotificationMessage {
  subject: Subjects.SOCKET_NOTIFICATION;
  data: {
    content: string;
    campaign_id: string;
    event_id: string;
    feedback_id: string;
  };
}

export interface HighUrgencyAnalysisMessage {
  subject: Subjects.ANALYSIS_HIGH_URGENCY;
  data: {
    feedback_id: string;
    event_id: string;
    campaign_id: string;
    message_id: string;
  };
}
