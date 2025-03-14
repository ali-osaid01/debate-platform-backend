import { Schema} from "mongoose";
import { ENOTIFICATION_TYPES } from "../../interface/enum";

export const notificationSchema: Schema = new Schema(
    {
      receiver: { type: Schema.Types.ObjectId, ref: "User" },
      sender: { type: Schema.Types.ObjectId, ref: "User" },
      type: { type: Number, enum: ENOTIFICATION_TYPES},
      content: { type: String, required: true },
      title: { type: String, default: null },
      metadata: [{ type: Schema.Types.Mixed }],
      isRead: { type: Boolean, default: false },
    },
    {timestamps:true}
  );
  