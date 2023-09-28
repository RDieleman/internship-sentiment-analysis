interface Campaign {
  _id: string;
  title: string;
  description: string;
  is_archived: boolean;
  start_date: Date;
  participant_ids: Array<string>;
}

interface Event {
  _id: string;
  image_url: string;
  post_date: Date;
  description: string;
  type: string;
  campaign_id: string;
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

export { Campaign, Event, UserInfo, Session, SessionInfo };
