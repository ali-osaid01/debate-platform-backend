import { Schema } from "mongoose";
import { ILike } from "../../interface/like.interface";

export const likeSchema: Schema<ILike> = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    event: { type: Schema.Types.ObjectId, ref: 'Event', required: true },
    status: {type:Boolean,default:true},
},{timestamps:true});

likeSchema.index({ user: 1, event: 1 }, { unique: true });
