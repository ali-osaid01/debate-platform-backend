import  { Schema } from "mongoose";
import { IBadge } from "../../interface/badge.interface";

const BadgeSchema = new Schema<IBadge>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      required: true,
      trim: true,
    },
   
  },
  {
    timestamps: true, 
  }
);

export { BadgeSchema};
