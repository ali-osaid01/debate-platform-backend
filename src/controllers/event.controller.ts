import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../utils/helpers";
import EventService from "../services/event.service";
import { IEvent } from "../interface/event.interface";
import { ApprovalStatus } from "../interface/enum";
import mongoose from "mongoose";

class EventController {
  private EventService: EventService;
  
  constructor() {
    this.EventService = new EventService();
  }

  public create = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const body = req.body;
      const payload: IEvent = { ...body, postedBy: req.user.id };
      console.log("PAYLOAD GET ->", payload);
      const response = await this.EventService.create(payload,req.user.username);
      res.status(response.code).json(response);
    },
  );

  public index = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const {
        page = 1,
        limit = 10,
        status = ApprovalStatus.PENDING,
        postedBy,
        type
      } = req.query;

      const pipeline: any[] = [];

      const matchStage: any = {
        isDeleted: false,
        approvalStatus: status as ApprovalStatus,
      };

      console.log("POSTED BY ->",postedBy);
      if (postedBy) matchStage.postedBy = new mongoose.Types.ObjectId(postedBy as string);
      if (type) matchStage.type = type;

      // Add the $match stage to the pipeline
      pipeline.push({ $match: matchStage });

      const response = await this.EventService.index(pipeline, +page, +limit,req.user.id);
      res.status(response.code).json(response);
    },
  );

  public update = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const { id } = req.params;
      const data = req.body;
      const response = await this.EventService.update(id, data);
      res.status(response.code).json(response);
    },
  );

  public delete = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const { id } = req.params;
      const response = await this.EventService.delete(id);
      res.status(response.code).json(response);
    },
  );

  public toggleEvent = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const user = req.user.id;
      const { event, status } = req.body;
      const response = await this.EventService.toggleEvent(event, status, user);
      res.status(response.code).json(response);
    },
  );

  public toggleUserStatus = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const { event, status, user,notification } = req.body;
      const response = await this.EventService.toggleUserStatus(
        user,
        event,
        status,
        notification
      );
      res.status(response.code).json(response);
    },
  );
}

export default EventController;
