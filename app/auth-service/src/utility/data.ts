import { TYPES, container } from '../../inversify.config';
import usersData from '../data/users.json';
import { User } from '../interfaces/models';
import { IUserRepository } from '../interfaces/repositories';
import passwordService from '../services/passwordService';

const insertTestData = async () => {
  console.log('Attempting to insert test data...');
  const userRepository = container.get<IUserRepository>(TYPES.USER_REPOSITORY);

  const existingUserCount = await (await userRepository.getAll()).length;
  if (existingUserCount > 0) {
    console.error('Database already contains data.');
    return;
  }

  const promises = usersData.map(async (entry) => {
    const passwordHash = await passwordService.toHash(entry.password);
    return {
      username: entry.username,
      _id: entry._id,
      passwordHash,
    };
  });

  const formattedData: User[] = await Promise.all(promises);

  await userRepository.insertMany(formattedData);
  console.log('Inserted test data.');
};

export default insertTestData;
