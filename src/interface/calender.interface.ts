import { Document, Types } from "mongoose";
import { IEvent } from "./event.interface";
import { IUser } from "./user.interface";

export interface ICalendar extends Document {
    events: string | Types.ObjectId | IEvent;
    creator: string | Types.ObjectId | IUser;
    createdAt: Date;
    updatedAt: Date;
}

export type CalenderDocument = ICalendar & Document;
