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

export interface ChatReceivedMessage {
  subject: Subjects.CHAT_RECEIVED;
  data: {
    content: string;
    event_id: string | null;
    campaign_id: string;
    feedback_id: string | null;
    is_ref: boolean;
    ref_type: string | null;
    ref_id: string | null;
  };
}
