import { Document, ObjectId } from "mongoose";
import { ENOTIFICATION_TYPES } from "./enum";

export interface INotification {
    receiver: string | ObjectId;
    sender: string | ObjectId;
    type: ENOTIFICATION_TYPES;
    content: string;
    title: string;
    isRead: boolean;
    data?: any;
  }
  
  export interface IMultipleNotification {
    title: string;
    content: string;
    receiver?: string[];
    sender?: string | ObjectId;
    type: number;
    all?: boolean;
    isRead: boolean;
    data?: any;
  }

  export type NotificationDocument = INotification & Document;
