import { NextFunction, Request, Response } from "express";
import UserService from "../services/user.service";
import { asyncHandler } from "../utils/helpers";
import { IUser } from "../interface/user.interface";
import { EUserRole } from "../interface/enum";
import mongoose from "mongoose";

class UserController {
  private UserService: UserService;
  constructor() {
    this.UserService = new UserService();
  }

  public index = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const { page = 1, limit = 10, search } = req.query;
      const user = req.user.id;
      const filter: Partial<IUser> = {
        _id: { $ne: new mongoose.Types.ObjectId(user) },
        role: EUserRole.USER,
      } as any;
      if (search)
        filter.username = { $regex: search as string, $options: "i" } as any;
      const response = await this.UserService.index(
        filter,
        Number(page),
        Number(limit),
      );
      res.status(response.code).json(response);
    },
  );

  public update = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const payload = req.body;
      const id = req.user.id;
      const response = await this.UserService.update(id, payload);
      res.status(response.code).json(response);
    },
  );

  public authenticatedUser = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const { userId } = req.query;
      const id = req.user.id;
      const response = await this.UserService.authenticatedUser(
        userId ? String(userId) : id,
      );
      res.status(response.code).json(response);
    },
  );
}

export default UserController;
