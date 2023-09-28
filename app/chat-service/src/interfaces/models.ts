interface Message {
  _id: string;
  content: string;
  creation_date: Date;
  feedback_id: string | null;
  event_id: string | null;
  campaign_id: string;
  is_ref: boolean;
  ref_type: string | null;
  ref_id: string | null;
}

interface UserInfo {
  _id: string;
  username: string;
}

interface Session {
  token: string;
}

interface SessionInfo {
  userInfo: UserInfo;
  issuedAt: number;
  expiresAt: number;
  isValid: boolean;
}

interface CustomMessage {
  ChatMessageId: string;
  CampaignId: string;
  TimelineEventId: string;
  ParticipantId: string;
  Text: string;
  SentDateTime: Date;
}

export { Message, UserInfo, Session, SessionInfo, CustomMessage };
