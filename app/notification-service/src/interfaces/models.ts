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

export { UserInfo, Session, SessionInfo };
