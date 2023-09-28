import 'reflect-metadata';
import app from './server';
import mongoose from 'mongoose';
import insertTestData from './utility/data';
import { tryCatchWithRetry } from './utility/functions';
import { container } from '@rdieleman/messaging';
import { IMessageService } from '@rdieleman/messaging/build/core';

/**
 * Entry point for the app.
 */
async function main() {
  if (process.env.MONGO_DB_URI == null) {
    throw new Error('MONGO_DB_URI must be defined');
  }

  if (
    process.env.NATS_CLUSTER_ID == null ||
    process.env.NATS_CLIENT_ID == null ||
    process.env.NATS_URL == null
  ) {
    throw new Error('NATS properties must be defined.');
  }

  if (
    process.env.JWT_OPTION_TOKEN == null ||
    process.env.JWT_OPTION_EXPIRES_IN == null
  ) {
    throw new Error('JWT Options must be defined');
  }

  if (
    process.env.COOKIE_OPTION_NAME == null ||
    process.env.COOKIE_OPTION_SIGNED == null ||
    process.env.COOKIE_OPTION_SECURE == null ||
    process.env.COOKIE_OPTION_SECRET_KEY == null
  ) {
    throw new Error('Cookie options must be defined.');
  }

  // Connect to the database.
  await tryCatchWithRetry(
    async () => {
      await mongoose.connect(process.env.MONGO_DB_URI + '/campaigns');
      console.log('Connected to MongoDB');
    },
    [],
    3,
    4000
  );

  //Insert test data
  await insertTestData();

  // Connect to messaging server
  await tryCatchWithRetry(
    async () => {
      const messageService = container.get<IMessageService>('IMessageService');

      await messageService.init(
        process.env.NATS_URL,
        process.env.NATS_CLUSTER_ID,
        'campaign-service',
        () => process.exit()
      );

      process.on('SIGINT', () => messageService.close());
      process.on('SIGTERM', () => messageService.close());

      console.log('Setting up listeners....');
    },
    [],
    3,
    4000
  );

  // Start API.
  app.listen(3000, () => {
    console.log('Listening on port 3000.');
  });
}

main()
  .then(() => console.log('App started.'))
  .catch(console.error);
