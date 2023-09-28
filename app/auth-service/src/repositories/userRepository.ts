import { injectable } from 'inversify';
import { User } from '../interfaces/models';
import { IUserRepository } from '../interfaces/repositories';
import { UserModel, IUserDoc } from '../models/user';
import mongoose from 'mongoose';

@injectable()
export default class MongoUserRepository implements IUserRepository {
  private docToEntity(doc: IUserDoc): User {
    return {
      _id: doc._id,
      username: doc.username,
      passwordHash: doc.passwordHash,
    };
  }

  private entityToDoc(entity: User): IUserDoc {
    const doc: IUserDoc = new UserModel({
      _id: entity._id,
      username: entity.username,
      passwordHash: entity.passwordHash,
    });

    return doc;
  }

  async getAll(): Promise<User[]> {
    const docs = await UserModel.find({}).exec();

    const users = docs.map((doc) => {
      return this.docToEntity(doc);
    });

    return users;
  }

  async getById(id: string): Promise<User> {
    const doc = await UserModel.findById(id).exec();
    if (doc == null) {
      return null;
    }

    return this.docToEntity(doc);
  }

  async getByUsername(username: string): Promise<User | null> {
    const doc = await UserModel.findOne({
      username: {
        $regex: `^${username}$`,
        $options: 'i',
      },
    });

    if (doc == null) {
      return null;
    }

    return this.docToEntity(doc);
  }

  async createOne(username: string, passwordHash: string): Promise<User> {
    const doc = new UserModel({
      username,
      passwordHash,
    });

    await doc.save();

    return this.docToEntity(doc);
  }

  async deleteById(id: string): Promise<Boolean> {
    try {
      await UserModel.findOneAndRemove({ _id: id });
      return true;
    } catch (err) {
      console.error(`Failed to delete user with provided id ${id}.`, err);
      return false;
    }
  }

  async insertMany(entities: User[]): Promise<void> {
    const docs = entities.map((entity) => {
      return this.entityToDoc(entity);
    });

    //@ts-ignore
    await UserModel.collection.insertMany(docs);
    return;
  }
}
