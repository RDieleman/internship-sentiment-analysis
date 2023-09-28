import express, { Request, Response } from 'express';
import campaignService from '../services/campaignService';
import asyncHandler from 'express-async-handler';
import { body, param } from 'express-validator';
import { validateRequest } from '../middlewares/validateRequest';

const router = express.Router();

router.get(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    const data = await campaignService.retrieveAll(req.sessionInfo.userInfo);
    res.status(200).send(data);
  })
);

router.get(
  '/participants/:campaignId',
  [param('campaignId').isUUID().notEmpty()],
  validateRequest,
  asyncHandler(async (req: Request, res: Response) => {
    const { campaignId } = req.params;

    const ids = await campaignService.getCampaignUsers(campaignId);
    res.status(200).send({
      campaign_id: campaignId,
      participant_ids: ids,
    });
  })
);

router.post(
  '/import',
  [
    body('campaignIds').isArray().notEmpty(),
    body('campaignIds.*').isUUID().notEmpty(),
    body('userId').isUUID().notEmpty(),
  ],
  validateRequest,
  asyncHandler(async (req: Request, res: Response) => {
    const { campaignIds, userId } = req.body;

    const uniqueIds = new Set<string>(campaignIds);
    const promises = Array.from(uniqueIds).map(async (id) => {
      await campaignService.importCustomCampaign(id, userId);
    });

    await Promise.all(promises);
    res.status(200).send();
  })
);

export { router as campaignRouter };
