interface Feedback {
  _id: string;
  content: string;
  is_processed: boolean;
  is_assigned: boolean;
  message_id: string;
  campaign_id: string;
  event_id: string;
  creation_date: Date;
}

interface Analysis {
  _id: string;
  sentiment: string;
  is_question: boolean;
  emotion: string;
  has_urgency: boolean;
  feedback_id: string;
}

interface AnalysisResponse {
  sentiment: string;
  emotion: string;
  question: boolean;
  flagged: boolean;
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

export { Feedback, Analysis, AnalysisResponse, UserInfo, Session, SessionInfo };
