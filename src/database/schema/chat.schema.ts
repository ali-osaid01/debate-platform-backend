import { Schema } from 'mongoose';


const chatSchema = new Schema({
    type: { type: String, required: true, enum: ['group'],default: 'group' },
    name: String,
    event: { type: Schema.Types.ObjectId, ref: 'Event' },
    creator: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    participants: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    hasVideoCallOccurred: { type: String, enum: ['ongoing', 'completed'], default: 'not-started' },
    picture:{ type: String, default: null },
    lastMessage: { type: Schema.Types.ObjectId, ref: 'Message' },
    isActive: { type: Boolean, default: true },
  }, {
    timestamps: true,
  });



export default chatSchema;