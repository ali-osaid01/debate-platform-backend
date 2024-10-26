import { Request, Response, NextFunction } from "express";
import { asyncHandler, generateResponse, parseBody } from "../utils/helpers";
import { UserService } from "../services";
import { IPaginationParams } from "../utils/interfaces";
import { STATUS_CODES } from "../interface/enum";
import { SUCCESS_DATA_SHOW_PASSED, SUCCESS_REGISTRATION_PASSED } from "../utils/constants";

class UserController {
    public register = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const body = parseBody(req.body);

        const userExists = await UserService.getOne({ email: body?.email });
        if (userExists) {
            return next({
                statusCode: STATUS_CODES.CONFLICT,
                message: "User already exists",
            });
        }

        const user: any = await UserService.create(body);
        const accessToken = await user.generateAccessToken();
        req.session = { accessToken };

        generateResponse(user,SUCCESS_REGISTRATION_PASSED,res)
    });

    public login = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const body = parseBody(req.body);

        let user: any = await UserService.getOne({ email: body.email }, '+password');
        if (!user) {
            return next({
                statusCode: STATUS_CODES.BAD_REQUEST,
                message: 'Invalid email or password',
            });
        }

        const isMatch = await user.isPasswordCorrect(body.password);
        if (!isMatch) {
            return next({
                statusCode: STATUS_CODES.UNAUTHORIZED,
                message: 'Invalid password',
            });
        }

        const accessToken = await user.generateAccessToken();
        req.session = { accessToken };

        user = await UserService.updateOne({ _id: user._id }, { fcmToken: body.fcmToken, name: 'User Testing11' }).select('+fcmtoken');
        generateResponse(user,SUCCESS_REGISTRATION_PASSED,res)
    });

    // Fetch all users with pagination
    public fetchAllUsers = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const { page = 1, limit = 10, search = '' }: IPaginationParams = req.query;
        const query = {
            $or: [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
            ],
        };

        const usersData = await UserService.getAll({ query, page, limit });
        generateResponse(usersData,SUCCESS_DATA_SHOW_PASSED,res)
    });

    // Fetch a single user
    public fetchUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const user = await UserService.getOne({ _id: req.user.id });
        
        if (!user) {
            return next({
                statusCode: STATUS_CODES.BAD_REQUEST,
                message: 'Invalid email or password',
            });
        }

        generateResponse(user,SUCCESS_DATA_SHOW_PASSED,res)
    });
}

export default new UserController();
