import { NextFunction, Request, Response } from 'express';
import { Session, SessionInfo } from '../interfaces/models';
import { SessionService } from '../services/sessionService';
import { AuthenticationFailedError } from '../errors/authenicationFailedError';

// Add current user property to the Request interface.
declare global {
  namespace Express {
    interface Request {
      sessionInfo?: SessionInfo;
      session?: Session;
    }
  }
}

export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Public endpoints don't require authentication.
  const inPublicEndpoint = req.path.startsWith('/api/campaigns/public');

  let sessionInfo: SessionInfo;

  // If present, attempt to get user from session.
  if (req.session) {
    try {
      sessionInfo = await SessionService.getFromToken(req.session);
    } catch (ex) {
      console.error('Failed to retrieve user from session.');
    }
  }

  const isAuthenticated = sessionInfo != null && sessionInfo.isValid;

  if (isAuthenticated) {
    req.sessionInfo = sessionInfo;
  }

  // Authentication always required, unless in a public endpoint.
  if (isAuthenticated || inPublicEndpoint) {
    return next();
  }

  next(new AuthenticationFailedError());
};
