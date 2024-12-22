import { Schema } from 'mongoose';


const chatSchema = new Schema({
    type: { type: String, required: true, enum: ['group'],default: 'group' },
    name: String,
    event: { type: Schema.Types.ObjectId, ref: 'Event' },
    creator: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    participants: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    lastMessage: { type: Schema.Types.ObjectId, ref: 'Message' },
    isActive: { type: Boolean, default: true },
  }, {
    timestamps: true,
  });



export default chatSchema;