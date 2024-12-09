import { Moment } from "moment";
import { Document } from "mongoose";

export interface ICategory  {
    title: string;
    parent?: string | ICategory;
    isDeleted?: boolean;
    createdAt?: Date | Moment;
    updatedAt?: Date | Moment;
}

export type CategoryDocument = ICategory & Document;
