import { Schema } from "mongoose";
import { IFollow } from "../../interface/follow.interface";

export const FollowSchema: Schema<IFollow> = new Schema({
    follower: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    followed: { type: Schema.Types.ObjectId, ref: 'User', required: true },
},{timestamps:true});

