import express, { Request, Response } from 'express';
import { validateRequest } from '../middlewares/validateRequest';
import { body, param } from 'express-validator';
import asyncHandler from 'express-async-handler';
import feedbackService from '../services/feedbackService';

const router = express.Router();

router.get(
  '/all',
  asyncHandler(async (req: Request, res: Response) => {
    const data = await feedbackService.retrieveAll();
    res.status(200).send(data);
  })
);

router.get(
  '/campaign/:campaignId',
  [param('campaignId').isString()],
  validateRequest,
  asyncHandler(async (req: Request, res: Response) => {
    const { campaignId } = req.params;

    const data = await feedbackService.retrieveByCampaignId(campaignId);

    res.status(200).send(data);
  })
);

router.put(
  '/:feedbackId',
  [
    param('feedbackId').isString(),
    body('is_processed').isBoolean(),
    body('is_assigned').isBoolean(),
  ],
  validateRequest,
  asyncHandler(async (req: Request, res: Response) => {
    const { feedbackId } = req.params;
    const { is_processed, is_assigned } = req.body;

    await feedbackService.updateStatus(feedbackId, {
      isProcessed: is_processed,
      isAssigned: is_assigned,
    });

    res.status(200).send();
  })
);

export { router as feedbackRouter };
