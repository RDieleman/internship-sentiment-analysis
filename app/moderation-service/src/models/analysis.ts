import mongoose from 'mongoose';
import { Analysis } from '../interfaces/models';
import { randomUUID } from 'crypto';

interface IAnalysisDoc extends mongoose.Document {
  _id: string;
  sentiment: string;
  is_question: boolean;
  emotion: string;
  has_urgency: boolean;
  feedback_id: string;
}

interface IAnalysisModel extends mongoose.Model<IAnalysisDoc> {
  build(attrs: Analysis): IAnalysisDoc;
}

const analysisSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: () => randomUUID(),
    },
    sentiment: {
      type: String,
      enum: ['Positive', 'Negative', 'Neutral'],
      required: true,
    },
    is_question: {
      type: Boolean,
      required: true,
    },
    emotion: {
      type: String,
      required: true,
    },
    has_urgency: {
      type: Boolean,
      required: true,
    },
    feedback_id: {
      type: String,
      ref: 'Feedback',
      required: true,
    },
  },
  { collection: 'analyses' }
);

analysisSchema.statics.build = (attrs: Analysis) => {
  return new AnalysisModel(attrs);
};

const AnalysisModel = mongoose.model<IAnalysisDoc, IAnalysisModel>(
  'Analysis',
  analysisSchema
);

export { AnalysisModel, IAnalysisDoc };
