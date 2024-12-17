import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../utils/helpers";
import FollowService from "../services/follower.service";

class FollowController {
  private FollowService: FollowService;

  constructor() {
    this.FollowService = new FollowService();
  }

  public create = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const { followed } = req.body;
      const follower = req.user.id;
      const response = await this.FollowService.create(
        follower,
        followed,
        req.user.name,
      );
      res.status(response.code).json(response.data);
    },
  );

  public isFollowed = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const { followed } = req.query;
      console.log("USER CURRENT ->", req.user.id);
      console.log("FOLLOWED ->", followed);
      const response = await this.FollowService.getOne(
        req.user.id,
        followed as string,
      );
      res.status(response.code).json(response.data);
    },
  );
}

export default FollowController;
