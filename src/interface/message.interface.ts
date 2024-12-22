import { Document, ObjectId } from "mongoose";
import { IUser } from "./user.interface";
import { IChat } from "./chat.interface";

export interface IMessage {
    
    chat: string | IChat | ObjectId; 
    sender: string | IUser | ObjectId;
    type: "text" | "image" | "video" | "audio" | "document";
    content: string; 
    isDeleted: boolean; 
    createdAt: Date; 
    updatedAt: Date; 
  }

  export type MessageDocument = IMessage & Document;