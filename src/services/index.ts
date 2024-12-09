import BaseModel from "../database/common/BaseModel";
import { categorySchema } from "../database/schema/category.schema";
import { eventSchema } from "../database/schema/event.schema";
import { FollowSchema } from "../database/schema/follow.schema";
import { likeSchema } from "../database/schema/like.schema";
import { notificationSchema } from "../database/schema/notification.schema";
import { UserDocument, UserSchema } from "../database/schema/user.schema";
import { CategoryDocument } from "../interface/category.interface";
import { EventDocument } from "../interface/event.interface";
import { FollowDocument } from "../interface/follow.interface";
import { LikeDocument } from "../interface/like.interface";
import { NotificationDocument } from "../interface/notification.interface";

export const userRepository = new BaseModel<UserDocument>("User", UserSchema);
export const eventRepository = new BaseModel<EventDocument>("Event",eventSchema);
export const notificationRepository = new BaseModel<NotificationDocument>("Notification",notificationSchema);
export const likeRepository = new BaseModel<LikeDocument>("Like",likeSchema);
export const followRepository = new BaseModel<FollowDocument>("Follow",FollowSchema); 
export const categoryRepository = new BaseModel<CategoryDocument>("Category",categorySchema); 