import {  notificationRepository } from "./index";
import { ApiResponse } from "../interface";
import { INotification } from "../interface/notification.interface";
import Response from "../utils/response";

class NotificationService {
    private Response: Response;

    constructor() { this.Response = new Response() }

    index = async (filter: Partial<INotification>, page: number, limit: number): Promise<ApiResponse> => {
        try {
            const notification = await notificationRepository.getAll({ query: filter, page, limit, populate:{path:"sender",select:"name email profilePicture"}});
            return this.Response.sendSuccessResponse("Events Fetch Successfully", notification);
        } catch (error) {
            return this.Response.sendResponse(500, { msg: "Something went wrong", error });
        }
    };
}

export default NotificationService;
