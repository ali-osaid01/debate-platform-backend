import { Schema } from 'mongoose';
import { IEvent } from '../../interface/event.interface';
import { ApprovalStatus, EventStatus } from '../../interface/enum';

export const eventSchema: Schema<IEvent> = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    postedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    description: {
      type: String,
      required: true,
    },
    picture: {
      type: String,
    },
    date: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: EventStatus,
      default: EventStatus.ACTIVE
    },
    approvalStatus: {
      type: String,
      enum: ApprovalStatus,
      default: ApprovalStatus.PENDING
    },
    location: {
      type: String,
    },
    participants: {
      type: [{ type: Schema.Types.ObjectId, ref: 'User' }],
      default: [],
    },
    isDeleted: {
      type: Boolean
    }
  },
  { timestamps: true }
);

