import { Schema, model, Document, Types } from 'mongoose';

export type TransferStatus = 'pending' | 'uploading' | 'completed' | 'failed' | 'cancelled';

export interface ITransfer extends Document {
  _id: Types.ObjectId;
  sender: Types.ObjectId;
  recipient: Types.ObjectId;
  file: Types.ObjectId;
  status: TransferStatus;
  progress: number;
  message?: string;
  errorMessage?: string;
  sharedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const TransferSchema = new Schema<ITransfer>(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    recipient: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    file: {
      type: Schema.Types.ObjectId,
      ref: 'File',
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ['pending', 'uploading', 'completed', 'failed', 'cancelled'],
      default: 'pending',
      index: true,
    },
    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    message: {
      type: String,
      default: '',
    },
    errorMessage: {
      type: String,
      default: '',
    },
    sharedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export const Transfer = model<ITransfer>('Transfer', TransferSchema);
