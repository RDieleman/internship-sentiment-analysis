import jwt, { JwtPayload } from 'jsonwebtoken';
import { Session, SessionInfo, UserInfo } from '../interfaces/models';

export class SessionService {
  private static isValid(payload: JwtPayload): boolean {
    if (!payload || !payload.iat || !payload.exp) {
      return false;
    }

    const now = Date.now().valueOf() / 1000;
    const tokenHasExpired = payload.exp < now;

    const isValid = tokenHasExpired == false;
    return isValid;
  }

  static generateToken(userInfo: UserInfo): Session {
    const session: Session = {
      token: jwt.sign({ userInfo }, process.env.JWT_OPTION_TOKEN, {
        expiresIn: process.env.JWT_OPTION_EXPIRES_IN,
      }),
    };
    return session;
  }

  static getFromToken(session: Session): SessionInfo | null {
    try {
      const payload: JwtPayload = jwt.verify(
        session.token,
        process.env.JWT_OPTION_TOKEN
      ) as JwtPayload;

      const isValid = this.isValid(payload);

      const info: SessionInfo = {
        userInfo: payload.userInfo,
        issuedAt: payload.iat,
        expiresAt: payload.exp,
        isValid: isValid,
      };
      return info;
    } catch (err) {
      console.log('Failed to get user from session.');
      return null;
    }
  }
}
