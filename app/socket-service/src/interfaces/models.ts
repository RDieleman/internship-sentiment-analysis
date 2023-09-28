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

interface SocketMessage {
  userInfo: UserInfo;
  dataString: any;
}

export { UserInfo, Session, SessionInfo, SocketMessage };
