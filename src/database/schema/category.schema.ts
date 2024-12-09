import { Schema } from "mongoose";

export const categorySchema: Schema = new Schema(
  { 
    title: { type: String, default: null },
    parent: { type: Schema.Types.ObjectId, ref: "Category", default: null },
    isDeleted: { type: Boolean, default: false },
  },
  {timestamps:true}
);

categorySchema.index(
  { parent: 1 },
  { partialFilterExpression: { parent: { $exists: true, $ne: null } } }
);

