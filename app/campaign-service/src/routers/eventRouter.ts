import express, { Request, Response } from 'express';
import eventService from '../services/eventService';
import { validateRequest } from '../middlewares/validateRequest';
import { body, param } from 'express-validator';
import asyncHandler from 'express-async-handler';

const router = express.Router();

router.get(
  '/:campaignId',
  [param('campaignId').isString()],
  validateRequest,
  asyncHandler(async (req: Request, res: Response) => {
    const { campaignId } = req.params;

    const data = await eventService.retrieveByCampaignId(campaignId);

    res.status(200).send(data);
  })
);

router.post(
  '/import',
  [
    body('events').isArray().notEmpty(),
    body('events.*.eventId').isUUID().notEmpty(),
    body('events.*.campaignId').isUUID().notEmpty(),
  ],
  validateRequest,
  asyncHandler(async (req: Request, res: Response) => {
    const { events } = req.body;

    const promises = events.map(async (event) => {
      return await eventService.importCustomEvent(
        event.eventId,
        event.campaignId
      );
    });

    await Promise.all(promises);
    res.status(200).send();
  })
);

export { router as eventRouter };
