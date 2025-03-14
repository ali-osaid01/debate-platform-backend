import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../utils/helpers";
import NotificationService from "../services/notification.service";
import { INotification } from "../interface/notification.interface";

class notificationController {
    private NotificationService: NotificationService
    constructor() { this.NotificationService = new NotificationService() }

    public index = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const { page = 1, limit = 10, type } = req.query;
        let filter: Partial<INotification> = { receiver: req.user.id};

        if (type !== undefined && !isNaN(Number(type))) {
            filter = { ...filter, type: Number(type)};
        }
        
        const response = await this.NotificationService.index(filter, Number(page), Number(limit));
        res.status(response.code).json(response);
    });

    public update = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const response = await this.NotificationService.update(req.user.id);
        res.status(response.code).json(response);
    })
}


export default notificationController
