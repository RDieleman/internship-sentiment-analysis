import { Subjects } from './subjects';

export interface ChatCreatedMessage {
  subject: Subjects.CHAT_CREATED;
  data: {
    _id: string;
    feedback_id: string | null;
    event_id: string | null;
    campaign_id: string;
    content: string;
    creation_date: Date;
    is_ref: boolean;
    ref_type: string | null;
    ref_id: string | null;
  };
}

export interface SocketFeedbackStatusMessage {
  subject: Subjects.SOCKET_FEEDBACK_STATUS_CHANGED;
  data: {
    feedback_id: string;
    is_processed: boolean;
    is_assigned: boolean;
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
