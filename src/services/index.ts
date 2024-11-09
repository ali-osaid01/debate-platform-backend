import BaseModel from "../database/common/BaseModel";
import { eventSchema } from "../database/schema/event.schema";
import { likeSchema } from "../database/schema/like.schema";
import { notificationSchema } from "../database/schema/notification.schema";
import { UserDocument, UserSchema } from "../database/schema/user.schema";
import { EventDocument } from "../interface/event.interface";
import { LikeDocument } from "../interface/like.interface";
import { NotificationDocument } from "../interface/notification.interface";

export const userRepository = new BaseModel<UserDocument>("User", UserSchema);
export const eventRepository = new BaseModel<EventDocument>("Event",eventSchema)
export const notificationRepository = new BaseModel<NotificationDocument>("Notification",notificationSchema);
export const likeRepository = new BaseModel<LikeDocument>("Like",likeSchema)