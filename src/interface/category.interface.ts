import { Moment } from "moment";
import { Document } from "mongoose";

export interface ICategory {
  _id: string;
  title: string;
  parent?: string | ICategory | null;
  isDeleted?: boolean;
  createdAt?: Date | Moment;
  updatedAt?: Date | Moment;
}

export type CategoryDocument = ICategory & Document;
