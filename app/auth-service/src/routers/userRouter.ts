import express, { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import userService from '../services/userService';
import { param } from 'express-validator';
import { validateRequest } from '../middlewares/validateRequest';
import { BadRequestError } from '../errors/badRequestError';

const router = express.Router();

router.get(
  '/me',
  asyncHandler(async (req: Request, res: Response) => {
    res.status(200).send(req.sessionInfo || null);
  })
);

router.get(
  '/all',
  asyncHandler(async (req: Request, res: Response) => {
    const users = await userService.getAllUsers();

    res.status(200).send(users);
  })
);

router.delete(
  '/:userId',
  [param('userId').isString()],
  validateRequest,
  asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.params;
    if (userId == req.sessionInfo.userInfo._id) {
      throw new BadRequestError("Can't delete your own account.");
    }

    await userService.deleteUser(userId);

    res.status(200).send();
  })
);

export { router as userRouter };
