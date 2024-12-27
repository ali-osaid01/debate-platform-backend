import { Document, ObjectId } from "mongoose";
import { IUser } from "./user.interface";
import { IEvent } from "./event.interface";

export interface IChat {
  id: string;
  type: 'group';
  name?: string;
  picture:string;
  lastMessage: string;
  event: string | IEvent;
  creator: string;
  participants: (string | undefined)[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type ChatDocument = IChat & Document;
  
