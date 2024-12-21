import { Schema } from 'mongoose';


const chatSchema = new Schema({
    type: { type: String, required: true, enum: ['group'],default: 'group' },
    name: String,
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    participants: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    lastMessage: { type: Schema.Types.ObjectId, ref: 'Message' },
    lastMessageAt: { type: Date, default: Date.now },
    isActive: { type: Boolean, default: true },
  }, {
    timestamps: true,
  });



export default chatSchema;