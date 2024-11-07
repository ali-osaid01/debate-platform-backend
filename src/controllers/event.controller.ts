import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../utils/helpers";
import EventService from "../services/event.service";
import { IEvent } from "../interface/event.interface";

class EventController {

    private EventService:EventService

    constructor(){ this.EventService = new EventService() }

    public create = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const data = req.body;
        const response = await this.EventService.create(data);
        res.status(response.code).json(response);
    });

    public index = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const { page = 1, limit = 10 } = req.query;
        const filter:Partial<IEvent> = {isDeleted:false};
        const response =  await this.EventService.index(filter,Number(page),Number(limit));
        res.status(response.code).json(response);
    });

    // public getEvent = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    //     const { id } = req.params;
    //     const response = await this.EventService.getEvent(id);
    //     res.status(response.code).json(response);
    // });

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
}

export default new EventController();
