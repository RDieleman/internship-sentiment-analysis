import { NextFunction, Request, Response } from 'express';
import toobusy from 'toobusy-js';

export const moderateEventLoop = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (toobusy()) {
    console.log('Too busy!');
    res.status(503).send('Server Too Busy');
  } else {
    next();
  }
};
