import mongoose from 'mongoose';
import { Feedback } from '../interfaces/models';
import { randomUUID } from 'crypto';

interface IFeedbackDoc extends mongoose.Document {
  _id: string;
  content: string;
  is_processed: boolean;
  is_assigned: boolean;
  message_id: string;
  campaign_id: string;
  event_id: string;
  creation_date: Date;
}

interface IFeedbackModel extends mongoose.Model<IFeedbackDoc> {
  build(attrs: Feedback): IFeedbackDoc;
}

const feedbackSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: () => randomUUID(),
    },
    content: {
      type: String,
      required: true,
    },
    is_processed: {
      type: Boolean,
      required: true,
      default: false,
    },
    is_assigned: {
      type: Boolean,
      required: true,
      default: false,
    },
    message_id: {
      type: String,
      required: true,
    },
    campaign_id: {
      type: String,
      required: true,
    },
    event_id: {
      type: String,
      required: true,
    },
    creation_date: {
      type: Date,
      required: true,
    },
  },
  { collection: 'feedback' }
);

feedbackSchema.statics.build = (attrs: Feedback) => {
  return new FeedbackModel(attrs);
};

const FeedbackModel = mongoose.model<IFeedbackDoc, IFeedbackModel>(
  'Feedback',
  feedbackSchema
);

export { FeedbackModel, IFeedbackDoc };
