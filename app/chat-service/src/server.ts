import express, { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';

const app = express();
app.disable('x-powered-by');

import cors from 'cors';
import morgan from 'morgan';
import { errorHandler } from './middlewares/errorHandler';
import { NotFoundError } from './errors/notFoundError';

import { messageRouter } from './routers/messageRouter';
import asyncHandler from 'express-async-handler';
import { healthRouter } from './routers/healthRouter';
import { rateLimit } from 'express-rate-limit';
import hpp from 'hpp';
import { moderateEventLoop } from './middlewares/eventLoopModerator';
import { requireAuth } from './middlewares/requireAuth';
import cookieSession from 'cookie-session';

app.use(moderateEventLoop);
app.use(cors());
app.use(helmet());
app.use(express.urlencoded());
app.use(express.json());
app.use(morgan('common'));
// Set rate limiter
const limiter = rateLimit({
  max: 200,
  windowMs: 60 * 60 * 1000,
  message: 'Too many request from this IP',
});
app.use(limiter);
app.use(hpp());

const cookieConfig = {
  name: process.env.COOKIE_OPTION_NAME,
  signed: process.env.COOKIE_OPTION_SIGNED === 'true',
  secure: process.env.COOKIE_OPTION_SECURE === 'true',
  httpOnly: true,
  sameSite: true,
  keys: [process.env.COOKIE_OPTION_SECRET_KEY],
  maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
};

app.use(cookieSession(cookieConfig));
app.use(requireAuth);

app.use('/api/chat/public/health', healthRouter);
app.use('/api/chat', messageRouter);

app.all(
  '*',
  asyncHandler(async (rq: Request, res: Response, next: NextFunction) => {
    throw new NotFoundError();
  })
);

app.use(errorHandler);

export default app;
