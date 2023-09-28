import { randomUUID } from 'crypto';
import { TYPES, container } from '../../inversify.config';
import campaignsData from '../data/campaigns.json';
import eventsData from '../data/events.json';
import { Campaign, Event } from '../interfaces/models';
import { IRepository, IEventRepository } from '../interfaces/repositories';

const insertTestData = async () => {
  console.log('Attempting to insert test data...');
  const campaignRepsitory = container.get<IRepository<Campaign>>(
    TYPES.CAMPAIGN_REPOSITORY
  );

  const existingCampaignsCount = await (
    await campaignRepsitory.getAll('6a8ad6f3-b0f6-4a4e-b6f1-ec33eb1f5a7a')
  ).length;
  if (existingCampaignsCount > 0) {
    console.error('Database already contains data.');
    return;
  }

  const formattedData: Campaign[] = campaignsData.map((entry) => {
    return {
      ...entry,
      start_date: new Date(entry.start_date),
      participant_ids: ['6a8ad6f3-b0f6-4a4e-b6f1-ec33eb1f5a7a'],
    };
  });

  await campaignRepsitory.insertMany(formattedData);

  const eventRepository = container.get<IEventRepository>(
    TYPES.EVENT_REPOSITORY
  );

  const existingEventCount = await (await eventRepository.getAll()).length;

  if (existingEventCount > 0) {
    console.error('Already data in the database.');
    return;
  }

  const formattedEvents: Event[] = eventsData.map((entry) => {
    return {
      ...entry,
      _id: randomUUID(),
      post_date: new Date(entry.post_date),
    };
  });

  await eventRepository.insertMany(formattedEvents);
  console.log('Inserted test data.');
};

export default insertTestData;
