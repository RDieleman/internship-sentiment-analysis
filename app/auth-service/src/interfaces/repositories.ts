import { User } from './models';

interface IUserRepository {
  getById(id: string): Promise<User | null>;
  getByUsername(username: string): Promise<User | null>;
  createOne(username: string, passwordHash: string): Promise<User>;
  deleteById(id: string): Promise<Boolean>;
  getAll(): Promise<User[]>;
  insertMany(entities: User[]): Promise<void>;
}

export { IUserRepository };
