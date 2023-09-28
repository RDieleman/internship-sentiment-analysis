import mongoose from 'mongoose';
import { Event } from '../interfaces/models';
import { randomUUID } from 'crypto';

interface IEventDoc extends mongoose.Document {
  image_url: string;
  post_date: Date;
  description: string;
  type: string;
  campaign_id: string;
}

interface IEventModel extends mongoose.Model<IEventDoc> {
  build(attrs: Event): IEventDoc;
}

const eventSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: () => randomUUID(),
    },
    image_url: {
      type: String,
      required: true,
    },
    post_date: {
      type: Date,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['info', 'question', 'learn'],
      required: true,
    },
    campaign_id: {
      type: String,
      ref: 'Campaign',
      required: true,
    },
  },
  { collection: 'events' }
);

eventSchema.statics.build = (attrs: Event) => {
  return new EventModel(attrs);
};

const EventModel = mongoose.model<IEventDoc, IEventModel>('Event', eventSchema);

export { EventModel, IEventDoc };
