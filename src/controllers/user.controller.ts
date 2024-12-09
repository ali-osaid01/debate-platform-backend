import { NextFunction, Request, Response } from "express";
import UserService from "../services/user.service";
import { asyncHandler } from "../utils/helpers";
import { IUser } from "../interface/user.interface";

class UserController {
     private UserService:UserService
    constructor(){this.UserService = new UserService()}

    public index = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const {page=1,limit=10} = req.query;
        const filter:Partial<IUser> = {}
        const response = await this.UserService.index(filter,Number(page),Number(limit));
        res.status(response.code).json(response);
    });
    
    public update = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const payload = req.body;
        const id = req.user.id
        const response = await this.UserService.update(id,payload);
        res.status(response.code).json(response);
    });

    public authenticatedUser = asyncHandler(async(req: Request, res: Response, next: NextFunction) => {
        const {userId} = req.query
        const id = req.user.id
        const response = await this.UserService.authenticatedUser(userId? String(userId) : id);
        res.status(response.code).json(response);
    });
}

export default UserController