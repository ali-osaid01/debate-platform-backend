import { Schema } from 'mongoose';
import {  EventStatus, ApprovalStatus, ParticipantStatus } from '../../interface/enum'; // Adjust import based on your setup
import { IEvent } from '../../interface/event.interface';

export const eventSchema: Schema<IEvent> = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    postedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
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
      enum: Object.values(EventStatus),
      default: EventStatus.ACTIVE,
    },
    approvalStatus: {
      type: String,
      enum: Object.values(ApprovalStatus),
      default: ApprovalStatus.PENDING,
    },
    location: {
      type: String,
    },
    participants: {
      type: [
        {
          user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
          },
          status: {
            type: String,
            enum: Object.values(ParticipantStatus),
            default: ParticipantStatus.PENDING,
          },
        }
      ],
      default: [],
      _id: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);
