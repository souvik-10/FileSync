import { Schema, model, Document, Types } from 'mongoose';

export type AIAnalysisType = 'summarize' | 'insights' | 'query';

export interface IAIAnalysis extends Document {
  _id: Types.ObjectId;
  file: Types.ObjectId;
  user: Types.ObjectId;
  type: AIAnalysisType;
  summary?: string;
  insights?: string[];
  queryPrompt?: string;
  response?: string;
  createdAt: Date;
  updatedAt: Date;
}

const AIAnalysisSchema = new Schema<IAIAnalysis>(
  {
    file: {
      type: Schema.Types.ObjectId,
      ref: 'File',
      required: true,
      index: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ['summarize', 'insights', 'query'],
      required: true,
    },
    summary: {
      type: String,
      default: '',
    },
    insights: [
      {
        type: String,
      },
    ],
    queryPrompt: {
      type: String,
      default: '',
    },
    response: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

export const AIAnalysis = model<IAIAnalysis>('AIAnalysis', AIAnalysisSchema);
