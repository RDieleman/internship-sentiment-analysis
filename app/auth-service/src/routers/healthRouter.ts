import express, { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';

const router = express.Router();

router.get(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    res.status(200).send();
  })
);

export { router as healthRouter };
