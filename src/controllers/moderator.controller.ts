import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../utils/helpers";
import ModeratorService from "../services/moderator.service";
import { EUserRole } from "../interface/enum";
import { IUser } from "../interface/user.interface";

class ModeratorController {
    ModeratorService: ModeratorService;
    constructor(){
        this.ModeratorService = new  ModeratorService()
     }

    public create = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const payload = {...req.body,role:EUserRole.MODERATOR};
        
        const response = await this.ModeratorService.create(payload);
        res.status(response.code).json(response);
    });

    public index = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const { page = 1, limit = 10 ,search = ""} = req.query;
        const query: Partial<IUser & { email?: any }> = {
            role:EUserRole.MODERATOR,
            email: { $regex: search, $options: "i" }
        }
        const response = await this.ModeratorService.index(query, +page, +limit);
        res.status(response.code).json(response);
    });
}

export default ModeratorController;
