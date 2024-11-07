import { EventDoucment } from "../interface/event.interface";
import BaseModel from "../database/common/BaseModel";
import { eventSchema } from "../database/schema/event.schema";
import { UserDocument, UserSchema } from "../database/schema/user.schema";

export const userRepository = new BaseModel<UserDocument>("User", UserSchema);
export const eventRepository = new BaseModel<EventDoucment>("Event",eventSchema)