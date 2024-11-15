import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../utils/helpers";
import EventService from "../services/event.service";
import { IEvent } from "../interface/event.interface";
import { ApprovalStatus } from "../interface/enum";

class EventController {
    private EventService:EventService
    constructor(){ this.EventService = new EventService() }

    public create = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const body = req.body;
        const payload:IEvent = {...body,postedBy:req.user.id};
        const response = await this.EventService.create(payload);
        res.status(response.code).json(response);
    });

    public index = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const { page = 1, limit = 10, status = ApprovalStatus.PENDING  } = req.query;
        const filter:Partial<IEvent> = {isDeleted:false,approvalStatus:status as ApprovalStatus };
        const response =  await this.EventService.index(filter,Number(page),Number(limit));
        res.status(response.code).json(response);
    });

    public update = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        const data = req.body;
        const response = await this.EventService.update(id, data);
        res.status(response.code).json(response);
    });

    public delete = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        const response = await this.EventService.delete(id);
        res.status(response.code).json(response);
    });

    public toggleEvent  = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const user = req.user.id; 
        const {event,status} = req.body;
        const response = await this.EventService.toggleEvent(event,status,user);
        res.status(response.code).json(response);
    });

    public toggleUserStatus  = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const {event,status,user} = req.body;
        const response = await this.EventService.toggleUserStatus(user,event,status);
        res.status(response.code).json(response);
    });
}

export default EventController
