import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../utils/helpers";
import  NotificationService from "../services/notification.service";
import { INotification } from "../interface/notification.interface";

class EventController {
    private NotificationService:NotificationService
    constructor(){ this.NotificationService = new NotificationService() }

    public index = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const { page = 1, limit = 10 } = req.query;
        const filter:Partial<INotification> = {receiver:req.user.id};
        const response =  await this.NotificationService.index(filter,Number(page),Number(limit));
        res.status(response.code).json(response);
    });

}

export default new EventController();
