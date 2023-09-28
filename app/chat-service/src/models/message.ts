import mongoose from 'mongoose';
import { Message } from '../interfaces/models';
import { randomUUID } from 'crypto';

interface IMessageDoc extends mongoose.Document {
  _id: string;
  content: string;
  creation_date: Date;
  feedback_id: string;
  event_id: string;
  campaign_id: string;
  is_ref: boolean;
  ref_type: string;
  ref_id: string;
}

interface IMessageModel extends mongoose.Model<IMessageDoc> {
  build(attrs: Message): IMessageDoc;
}

const messageSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: () => randomUUID(),
    },
    content: {
      type: String,
      required: true,
    },
    creation_date: {
      type: Date,
      required: true,
    },
    feedback_id: {
      type: String,
      required: false,
    },
    event_id: {
      type: String,
      required: false,
    },
    campaign_id: {
      type: String,
      required: true,
    },
    is_ref: {
      type: Boolean,
      required: true,
      default: false,
    },
    ref_type: {
      type: String,
      enum: ['Campaign', 'Event', 'Feedback', 'Person', null],
      required: false,
      default: null,
    },
    ref_id: {
      type: String,
      required: false,
    },
  },
  { collection: 'messages' }
);

messageSchema.statics.build = (attrs: Message) => {
  return new MessageModel(attrs);
};

const MessageModel = mongoose.model<IMessageDoc, IMessageModel>(
  'Message',
  messageSchema
);

export { MessageModel, IMessageDoc };
