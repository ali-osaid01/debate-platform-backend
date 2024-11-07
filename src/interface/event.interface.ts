import { Types,Document } from "mongoose";
import { IUser } from "./user.interface";
import { ApprovalStatus, EventStatus } from "./enum";

export interface IEvent  {
  title: string;
  description: string;
  date: Date;
  location: string;
  picture:string;
  postedBy: Types.ObjectId | string | IUser;
  status:EventStatus
  approvalStatus:ApprovalStatus
  participants: Types.ObjectId[] | string[] | IUser[]; 
  isDeleted:boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type EventDoucment = IEvent & Document;