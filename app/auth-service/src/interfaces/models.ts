interface User {
  _id: string;
  username: string;
  passwordHash: string;
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

export { User, Session, UserInfo, SessionInfo };
