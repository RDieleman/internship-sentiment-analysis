import express, { Request, Response } from 'express';
import { validateRequest } from '../middlewares/validateRequest';
import { body, param, query } from 'express-validator';
import asyncHandler from 'express-async-handler';
import messageService from '../services/messageService';

const router = express.Router();

router.get(
  '/:campaignId',
  [
    param('campaignId').isUUID().notEmpty(),
    query('eventId').optional().isUUID(),
    query('feedbackId').optional().isUUID(),
  ],
  validateRequest,
  asyncHandler(async (req: Request, res: Response) => {
    const { campaignId } = req.params;
    let { eventId, feedbackId } = req.query;
    eventId = eventId || null;
    feedbackId = feedbackId || null;

    //@ts-ignore
    const data = await messageService.retrieve(campaignId, eventId, feedbackId);

    res.status(200).send(data);
  })
);

router.post(
  '/import',
  [body('messages').isArray().isLength({ min: 1 })],
  validateRequest,
  asyncHandler(async (req: Request, res: Response) => {
    const { messages } = req.body;
    await messageService.handleBatchImport(messages);
    res.status(200).send();
  })
);

export { router as messageRouter };
