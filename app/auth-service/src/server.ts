import express from 'express';
import helmet from 'helmet';
import { moderateEventLoop } from './middlewares/eventLoopModerator';
import cookieSession from 'cookie-session';

const app = express();
app.use(moderateEventLoop);
app.disable('x-powered-by');

import morgan from 'morgan';
import { errorHandler } from './middlewares/errorHandler';
import { NotFoundError } from './errors/notFoundError';
import rateLimit from 'express-rate-limit';
import asyncHandler from 'express-async-handler';
import { healthRouter } from './routers/healthRouter';
import hpp from 'hpp';
import { requireAuth } from './middlewares/requireAuth';
import { userRouter } from './routers/userRouter';
import { authRouter } from './routers/authRouter';

app.use(express.urlencoded({ extended: true, limit: '1kb' }));
app.use(express.json({ limit: '1kb' }));
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

app.use('/api/auth/public/health/', healthRouter);
app.use('/api/auth/user/', userRouter);
app.use('/api/auth/', authRouter);

app.all(
  '*',
  asyncHandler(async (rq, res, next) => {
    throw new NotFoundError();
  })
);

app.use(errorHandler);

export default app;
