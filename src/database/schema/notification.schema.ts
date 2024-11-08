import { Schema} from "mongoose";
import { ENOTIFICATION_TYPES } from "../../interface/enum";

export const notificationSchema: Schema = new Schema(
    {
      receiver: { type: Schema.Types.ObjectId, ref: "User" },
      sender: { type: Schema.Types.ObjectId, ref: "User" },
      type: {
        type: Number,
        enum: ENOTIFICATION_TYPES,
        required: true,
      },
      content: { type: String, required: true },
      title: { type: String, default: null },
      isRead: { type: Boolean, default: false },
      data: {
        type: {
          serviceProvider: { type: Schema.Types.ObjectId, ref: "User" },
          task: { type: Schema.Types.ObjectId, ref: "Task" },
        },
        default: null,
      },
    },
    {timestamps:true}
  );
  