import {  Document, Types } from "mongoose";
import { IUser } from "./user.interface";
import { IEvent } from "./event.interface";

export interface ILike  {
    user: Types.ObjectId | string | IUser;
    event: Types.ObjectId | string | IEvent;
    status:boolean;
}

export type LikeDocument = ILike & Document;

