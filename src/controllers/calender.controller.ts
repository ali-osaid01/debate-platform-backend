import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../utils/helpers";
import { FetchCategoriesPipeline } from "../database/pipeline/category.pipeline";
import CalendarService from "../services/calender.service";

class CalendarController {
    private CalendarService: CalendarService;
  constructor() {
    this.CalendarService = new CalendarService();
  }

  public index = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      let { page = 1, limit = 10 } = req.query;
      page = Number(page);
      limit = Number(limit);
      const pipeline = FetchCategoriesPipeline();
      const response = await this.CalendarService.index(page, limit, pipeline);
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

export default CalendarController;
