import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../utils/helpers";
import CalendarService from "../services/calender.service";
import { ICalendar } from "../interface/calender.interface";
import mongoose from "mongoose";

export class CalendarController {
  private CalendarService: CalendarService;
  constructor() {
    this.CalendarService = new CalendarService();
  }

  public index = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      let { page = 1, limit = 10 } = req.query;
      page = Number(page);
      limit = Number(limit);
      const query: Partial<ICalendar> = {
        creator: new mongoose.Types.ObjectId(req.user.id)
      }
      const response = await this.CalendarService.index(page, limit, query);
      res.status(response.code).json(response);
    },
  );

  public delete = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const { id } = req.params;
      const response = await this.CalendarService.delete(id);
      res.status(response.code).json(response);
    },
  );

  public create = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const payload = req.body;
      const response = await this.CalendarService.create(payload);
      res.status(response.code).json(response);
    },
  );

}

