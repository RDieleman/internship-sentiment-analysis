import 'reflect-metadata';
import app from './server';
import mongoose from 'mongoose';
import insertTestData from './utility/data';
import { tryCatchWithRetry } from './utility/functions';

/**
 * Entry point for the app.
 */
async function main() {
  if (process.env.MONGO_DB_URI == null) {
    throw new Error('MONGO_DB_URI must be defined');
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
      await mongoose.connect(process.env.MONGO_DB_URI + '/auth');
      console.log('Connected to MongoDB');
    },
    [],
    3,
    4000
  );

  //Insert test data
  await insertTestData();

  // Start API.
  app.listen(3000, () => {
    console.log('Listening on port 3000.');
  });
}

main()
  .then(() => console.log('App started.'))
  .catch(console.error);
