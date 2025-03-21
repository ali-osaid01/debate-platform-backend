import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../utils/helpers";
import ModeratorService from "../services/moderator.service";

class ModeratorController {
    ModeratorService: ModeratorService;
    constructor(){
        this.ModeratorService = new  ModeratorService()
     }

    public create = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const payload = req.body;
        const response = await this.ModeratorService.create(payload);
        res.status(response.code).json(response);
    });

    public index = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const { page = 1, limit = 10 } = req.query;
        const response = await this.ModeratorService.index({}, +page, +limit);
        res.status(response.code).json(response);
    });
}

export default ModeratorController;
