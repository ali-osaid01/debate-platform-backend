import { Types, Document } from "mongoose";
import { IUser } from "./user.interface";
import { ApprovalStatus, EventStatus, ParticipantStatus } from "./enum";

export interface IParticipant {
  user: Types.ObjectId | string | IUser;
  status: ParticipantStatus;
}

export interface IEvent {
  title: string;
  description: string;
  type: string;
  date: Date;
  location: string;
  category: string;
  topic: string;
  picture: string;
  postedBy: Types.ObjectId | string | IUser;
  status: EventStatus;
  approvalStatus: ApprovalStatus;
  participants: IParticipant[];
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type EventDocument = IEvent & Document;
