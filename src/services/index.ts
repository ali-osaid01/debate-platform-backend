import BaseModel from "../database/common/BaseModel";
import { chatSchema } from "../database/schema/chat.schema";
import { categorySchema } from "../database/schema/category.schema";
import { eventSchema } from "../database/schema/event.schema";
import { FollowSchema } from "../database/schema/follow.schema";
import { likeSchema } from "../database/schema/like.schema";
import { messageSchema } from "../database/schema/message.schema";
import { notificationSchema } from "../database/schema/notification.schema";
import { UserDocument, UserSchema } from "../database/schema/user.schema";
import { CategoryDocument } from "../interface/category.interface";
import { ChatDocument } from "../interface/chat.interface";
import { EventDocument } from "../interface/event.interface";
import { FollowDocument } from "../interface/follow.interface";
import { LikeDocument } from "../interface/like.interface";
import { MessageDocument } from "../interface/message.interface";
import { NotificationDocument } from "../interface/notification.interface";
import { CalendarSchema } from "../database/schema/calender.schema";
import { CalenderDocument } from "../interface/calender.interface";
import { BadgeDocument } from "../interface/badge.interface";
import { BadgeSchema } from "../database/schema/badge.schema";

export const userRepository = new BaseModel<UserDocument>("User", UserSchema);
export const eventRepository = new BaseModel<EventDocument>("Event", eventSchema);
export const notificationRepository = new BaseModel<NotificationDocument>("Notification", notificationSchema);
export const likeRepository = new BaseModel<LikeDocument>("Like", likeSchema);
export const followRepository = new BaseModel<FollowDocument>("Follow", FollowSchema);
export const categoryRepository = new BaseModel<CategoryDocument>("Category", categorySchema);
export const chatRepository = new BaseModel<ChatDocument>("Chat", chatSchema);
export const messageRepository = new BaseModel<MessageDocument>("Message", messageSchema);
export const calendarRepository = new BaseModel<CalenderDocument>("Calender", CalendarSchema);
export const badgeRepository = new BaseModel<BadgeDocument>("Badge", BadgeSchema);