import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../utils/helpers";
import LikeService from "../services/like.service"; 

class LikeController {
    private likeService: LikeService;

    constructor() {
        this.likeService = new LikeService(); 
    }

    public create = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const { userId, eventId } = req.body; 
        const response = await this.likeService.toggleLike(userId, eventId);
        res.status(response.code).json(response);
    });
}

export default LikeController;
