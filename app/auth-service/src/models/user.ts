import mongoose from 'mongoose';
import { User } from '../interfaces/models';
import { randomUUID } from 'crypto';

interface IUserDoc extends mongoose.Document {
  _id: string;
  username: string;
  passwordHash: string;
}

const userSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: () => randomUUID(),
    },
    username: {
      type: String,
      required: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
  },
  {
    collection: 'users',
  }
);

interface IUserModel extends mongoose.Model<IUserDoc> {
  build(attrs: User): IUserDoc;
}

userSchema.statics.build = (attrs: User) => {
  return new UserModel(attrs);
};

const UserModel = mongoose.model<IUserDoc, IUserModel>('User', userSchema);

export { UserModel, IUserDoc };
