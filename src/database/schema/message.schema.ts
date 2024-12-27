import { Schema } from "mongoose";

export const messageSchema = new Schema({
    chat: { type: Schema.Types.ObjectId, ref: 'Chat', required: true },
    sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    messageType: { type: String, required: true, enum: ['text', 'image', 'video', 'audio', 'document'],default: 'text' },
    content: { type: String, required: true },
    isDeleted: { type: Boolean, default: false }
  }, {
    timestamps: true,
});
