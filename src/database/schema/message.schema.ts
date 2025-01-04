import { Schema } from "mongoose";

export const messageSchema = new Schema({
    chat: { type: Schema.Types.ObjectId, ref: 'Chat', required: true },
    sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    messageType: { type: String, required: true, enum: ['text', 'image', 'video', 'audio', 'document'],default: 'text' },
    isAnnocement: { type: Boolean, default: false },
    content: { type: String, required: true },
    isDeleted: { type: Boolean, default: false }
  }, {
    timestamps: true,
});

messageSchema.post("save", function (doc, next) {
  this.populate("sender", "name profilePicture username isAnnocement").then(() => {
      next();
  });
})