import { Request, Response, NextFunction } from "express";
import { asyncHandler, generateOTP, generateResponse, parseBody } from "../utils/helpers";
import { UserService } from "../services";
import { IPaginationParams } from "../utils/interfaces";
import { STATUS_CODES } from "../interface/enum";
import { SUCCESS_DATA_SHOW_PASSED, SUCCESS_LOGIN_PASSED, SUCCESS_REGISTRATION_PASSED } from "../utils/constants";

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

        user = await UserService.updateOne({ _id: user._id }, { fcmToken: body.fcmToken,}).select('+fcmtoken');
        generateResponse({user,accessToken},SUCCESS_LOGIN_PASSED,res)
    });
    public sendOtp = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const {email} = req.body;

        const user = await UserService.getOne({email}).lean();
        
        if(!user) return next({
                statusCode: STATUS_CODES.BAD_REQUEST,
                message: "User Not Found",
        })

        const otp = generateOTP();
        await UserService.updateById(user._id,{otp})
        generateResponse(otp,"OTP SEND TO EMAIL",res);
    });

    public verifyOtp = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const { email, otp } = req.body;

        const user:any = await UserService.getOne({ email });

        // Check if user exists
        if (!user) return next({
            statusCode: STATUS_CODES.BAD_REQUEST,
            message: "User Not Found",
        });

        // Check if OTP matches
        if (user.otp !== otp) return next({
            statusCode: STATUS_CODES.UNAUTHORIZED,
            message: "Invalid OTP",
        });

        // Update user verification status or clear OTP if necessary
        await UserService.updateById(user._id, { otp: null, isVerified: true });
        const token = user.generateAccessToken();

        generateResponse({token}, "OTP verified successfully", res);
    });

    public resetPassword = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const { password } = req.body;
        const user = req.user;
        console.log("USER ->",user)
        if (!user) {
            return next({
                statusCode: STATUS_CODES.BAD_REQUEST,
                message: "User not found",
            });
        }

        await UserService.updateById(user.id, { password });
        generateResponse(null, "Password reset successfully", res);
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
