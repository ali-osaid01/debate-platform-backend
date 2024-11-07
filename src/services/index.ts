import { EventDoucment } from "../interface/event.interface";
import BaseModel from "../database/common/BaseModel";
import { eventSchema } from "../database/schema/event.schema";
import { UserDocument, UserSchema } from "../database/schema/user.schema";

export const UserService = new BaseModel<UserDocument>("User", UserSchema);
export const EventService = new BaseModel<EventDoucment>("Event",eventSchema)