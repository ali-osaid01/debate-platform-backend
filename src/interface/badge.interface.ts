import { Document } from "mongoose";

export interface IBadge  {
    name: string; // Name of the badge
    image: string; // URL for the badge image
    createdAt: Date; // Date when the badge was created
    updatedAt: Date; // Date when the badge was last updated
  }

  export type BadgeDocument = IBadge & Document;
  