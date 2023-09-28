import express from 'express';
import helmet from 'helmet';
import { moderateEventLoop } from './middlewares/eventLoopModerator';

const app = express();
app.use(moderateEventLoop);
app.disable('x-powered-by');

import cors from 'cors';
import morgan from 'morgan';
import { errorHandler } from './middlewares/errorHandler';
import { campaignRouter } from './routers/campaignRouter';
import { NotFoundError } from './errors/notFoundError';
import rateLimit from 'express-rate-limit';
import asyncHandler from 'express-async-handler';
import { healthRouter } from './routers/healthRouter';
import hpp from 'hpp';
import { requireAuth } from './middlewares/requireAuth';
import cookieSession from 'cookie-session';
import { eventRouter } from './routers/eventRouter';

app.use(cors());
app.use(express.urlencoded());
app.use(express.json());
app.use(helmet());
// Set rate limiter
const limiter = rateLimit({
  max: 200,
  windowMs: 60 * 60 * 1000,
  message: 'Too many request from this IP',
});
app.use(limiter);
app.use(hpp());

app.use(morgan('common'));
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

app.use('/api/campaigns/public/health/', healthRouter);
app.use('/api/campaigns/events/', eventRouter);
app.use('/api/campaigns/', campaignRouter);

app.all(
  '*',
  asyncHandler(async (rq, res, next) => {
    throw new NotFoundError();
  })
);

app.use(errorHandler);

export default app;
