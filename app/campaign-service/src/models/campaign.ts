import mongoose from 'mongoose';
import { Campaign } from '../interfaces/models';
import { randomUUID } from 'crypto';

// Define the type of a document.
interface ICampaignDoc extends mongoose.Document {
  _id: string;
  title: string;
  description: string;
  is_archived: boolean;
  start_date: Date;
  participant_ids: Array<string>;
}

// Define schema to configure the structure of documents.
const campaignSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: () => randomUUID(),
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    is_archived: {
      type: Boolean,
      required: true,
      default: false,
    },
    start_date: {
      type: Date,
      required: true,
    },
    participant_ids: {
      type: [
        {
          type: String,
        },
      ],
      default: [],
      required: true,
    },
  },
  { collection: 'campaigns' }
);

// Define how the Business Entity is translated to a Document.
interface ICampaignModel extends mongoose.Model<ICampaignDoc> {
  build(attrs: Campaign): ICampaignDoc;
}

// Define factory to create Models from Business Entity.
campaignSchema.statics.build = (attrs: Campaign) => {
  return new CampaignModel(attrs);
};

// Define Model to interact with database.
const CampaignModel = mongoose.model<ICampaignDoc, ICampaignModel>(
  'Campaign',
  campaignSchema
);

export { CampaignModel, ICampaignDoc };
