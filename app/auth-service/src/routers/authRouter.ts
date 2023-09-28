import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import asyncHandler from 'express-async-handler';
import { validateRequest } from '../middlewares/validateRequest';
import userService from '../services/userService';
import authenticationService from '../services/authenticationService';

const router = express.Router();

router.post(
  '/public/signup',
  [body('username').isString(), body('password').isString()],
  validateRequest,
  asyncHandler(async (req: Request, res: Response) => {
    const { username, password } = req.body;

    await userService.createUser(username, password);

    res.status(201).send();
  })
);

router.post(
  '/public/signin',
  [body('username').isString(), body('password').isString()],
  validateRequest,
  asyncHandler(async (req: Request, res: Response) => {
    const { username, password } = req.body;

    const session = await authenticationService.login(username, password);
    req.session = session;
    res.status(200).send();
  })
);

router.post(
  '/signout',
  asyncHandler(async (req: Request, res: Response) => {
    req.session = null;
    res.status(200).send();
  })
);

export { router as authRouter };
