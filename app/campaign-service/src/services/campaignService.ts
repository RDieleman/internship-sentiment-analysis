import { TYPES, container } from '../../inversify.config';
import { BadRequestError } from '../errors/badRequestError';
import { NotFoundError } from '../errors/notFoundError';
import { Campaign, UserInfo } from '../interfaces/models';
import { IRepository } from '../interfaces/repositories';

class CampaignService {
  static instance: CampaignService;
  static campaignRepository: IRepository<Campaign>;

  constructor() {
    if (CampaignService.instance) {
      return CampaignService.instance;
    }
    CampaignService.campaignRepository = container.get<IRepository<Campaign>>(
      TYPES.CAMPAIGN_REPOSITORY
    );
    CampaignService.instance = this;
  }

  async retrieveAll(userInfo: UserInfo): Promise<Array<Campaign>> {
    try {
      const campaigns = await CampaignService.campaignRepository.getAll(
        userInfo._id
      );
      return campaigns;
    } catch (error) {
      throw error;
    }
  }

  async importCustomCampaign(campaignId: string, userId: string): Promise<void> {
    let campaign = await CampaignService.campaignRepository.getById(campaignId);

    const campaignDoesNotExist = campaign == null;
    if (campaignDoesNotExist) {
      campaign = await this.generateCampaign(campaignId);
    }

    const userIsNotPartOfCampaign = !campaign.participant_ids.includes(userId);
    if (userIsNotPartOfCampaign) {
      await this.addUserToCampaign(userId, campaign._id);
    }
  }

  private async addUserToCampaign(
    userId: string,
    campaignId: string
  ): Promise<Campaign> {
    let campaign = await CampaignService.campaignRepository.getById(campaignId);

    const campaignDoesNotExist = campaign == null;
    if (campaignDoesNotExist) {
      throw new BadRequestError('Campaign does not exist');
    }

    const uniqueIds = new Set<string>(campaign.participant_ids);
    uniqueIds.add(userId);

    campaign.participant_ids = Array.from(uniqueIds);

    await CampaignService.campaignRepository.updateOne(campaign);
    return campaign;
  }

  private async generateCampaign(campaignId: string): Promise<Campaign> {
    return await CampaignService.campaignRepository.createOne(
      campaignId,
      'Test Campaign',
      'This is a test campaign with a test description. This campaign is automatically generated, and does not contain any real data. Lorum Ipsum, etc.',
      new Date()
    );
  }

  async getCampaignUsers(campaignId: string): Promise<String[]> {
    const campaign = await CampaignService.campaignRepository.getById(
      campaignId
    );
    if (!campaign) {
      throw new NotFoundError();
    }

    return campaign.participant_ids;
  }
}

const campaignService = new CampaignService();
export default campaignService;
