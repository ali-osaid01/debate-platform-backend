import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../utils/helpers";

class EventController {
    public create = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        
    })

    public  index = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        
    })

    public update = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        
    })

    public delete = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        
    })
}

export default EventController