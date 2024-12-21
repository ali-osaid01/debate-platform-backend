import { Schema } from "mongoose";

const messageSchema = new Schema({
    chat: { type: Schema.Types.ObjectId, ref: 'Chat', required: true },
    sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, required: true, enum: ['text', 'image', 'video', 'audio', 'document'] },
    content: { type: String, required: true },
    media: { type: String, default: null }, 
    isDeleted: { type: Boolean, default: false }
  }, {
    timestamps: true,
});
