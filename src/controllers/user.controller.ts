import { NextFunction, Request, Response } from "express";
import UserService from "../services/user.service";
import { asyncHandler } from "../utils/helpers";
import { IUser } from "../interface/user.interface";

class UserController {

    public index = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const {page=1,limit=10} = req.query;
        const filter:Partial<IUser> = {}
        const response = await UserService.index(filter,Number(page),Number(limit));
        res.status(response.code).json(response);
    });
}

export default new UserController();