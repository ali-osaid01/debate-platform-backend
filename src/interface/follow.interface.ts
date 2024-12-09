import { Document } from "mongoose";
import { IUser } from "./user.interface";

export interface IFollow {
    follower: string | IUser;  
    followed: string | IUser;  
  }

export type FollowDocument = IFollow & Document;
