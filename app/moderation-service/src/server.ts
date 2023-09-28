import express from 'express';
import helmet from 'helmet';
const app = express();
app.disable('x-powered-by');

import cors from 'cors';
import morgan from 'morgan';
import { NotFoundError } from './errors/notFoundError';

import { feedbackRouter } from './routers/feedbackRouter';
import asyncHandler from 'express-async-handler';
import { healthRouter } from './routers/healthRouter';
import { errorHandler } from './middlewares/errorHandler';
import { rateLimit } from 'express-rate-limit';
import hpp from 'hpp';
import { moderateEventLoop } from './middlewares/eventLoopModerator';
import { requireAuth } from './middlewares/requireAuth';
import cookieSession from 'cookie-session';

app.use(moderateEventLoop);
app.use(cors());
app.use(helmet());
app.use(express.urlencoded({ extended: true, limit: '1kb' }));
app.use(express.json({ limit: '1kb' }));
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

app.use('/api/moderation/feedback', feedbackRouter);
app.use('/api/moderation/public/health/', healthRouter);

app.all(
  '*',
  asyncHandler(async (rq, res, next) => {
    throw new NotFoundError();
  })
);

app.use(errorHandler);

export default app;
