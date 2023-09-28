import express, { Request } from 'express';
import expressWs from 'express-ws';
import Websocket from 'ws';
import contentType from 'content-type';

const app = express();
export const wsInstance = expressWs(app);

app.disable('x-powered-by');

import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { errorHandler } from './middlewares/errorHandler';
import { NotFoundError } from './errors/notFoundError';

import interactionService from './services/interaction-service';
import HealthService from './services/health-service';
import { healthRouter } from './routers/healthRouter';
import { rateLimit } from 'express-rate-limit';
import hpp from 'hpp';
import getRawBody from 'raw-body';
import { moderateEventLoop } from './middlewares/eventLoopModerator';
import { requireAuth } from './middlewares/requireAuth';
import cookieSession from 'cookie-session';
import { SocketMessage } from './interfaces/models';

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

app.use(function (req, res, next) {
  if (!['POST', 'PUT', 'DELETE'].includes(req.method)) {
    next();
    return;
  }

  getRawBody(
    req,
    {
      length: req.headers['content-length'],
      limit: '1kb',
      encoding: contentType.parse(req).parameters.charset,
    },
    function (err, string) {
      if (err) return next(err);
      //@ts-ignore
      req.text = string;
      next();
    }
  );
});
new HealthService().start();

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

app.use('/socket/public/health/', healthRouter);

wsInstance.app.ws('/socket/', async (ws: Websocket, req: Request) => {
  ws.on('message', (data) => {
    const message: SocketMessage = {
      userInfo: req.sessionInfo!.userInfo,
      dataString: data,
    };
    console.log('Incomming socket message: ', message);

    interactionService.handleIncommingMessage(message);
  });
});

app.all('*', async (req, res, next) => {
  next(new NotFoundError());
});

app.use(errorHandler);

export default app;
