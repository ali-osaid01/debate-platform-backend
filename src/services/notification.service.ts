import {  notificationRepository } from "./index";
import { ApiResponse } from "../interface";
import { INotification } from "../interface/notification.interface";
import Response from "../utils/response";

class NotificationService {
    private Response: Response;

    constructor() { this.Response = new Response() }

    index = async (filter: Partial<INotification>, page: number, limit: number): Promise<ApiResponse> => {
        try {
            const [notification,count] = await Promise.all([
                notificationRepository.getAll({ query: filter, page, limit, populate:{path:"sender",select:"name email profilePicture"}}), 
                notificationRepository.getCount({...filter,isRead:false})
             ])
            return this.Response.sendSuccessResponse("Events Fetch Successfully", { notification, count });
        } catch (error) {
            return this.Response.sendResponse(500, { msg: "Something went wrong", error });
        }
    };

    update = async (id:string): Promise<ApiResponse> => {
        try {
            await notificationRepository.updateMany({ receiver: id }, { isRead: true });
            return this.Response.sendSuccessResponse("Notification Updated Successfully");
        } catch (error) {
            return this.Response.sendResponse(500, { msg: "Something went wrong", error });
        }
    }
}

export default NotificationService;
