// user.controller.ts
import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../utils/helpers";
import AuthService from "../services/auth.service";

class AuthController {
    
    public register = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const body = req.body;
        const response = await AuthService.register(body);
        res.status(response.code).json(response);
    });

    public login = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const { email, password, fcmToken } = req.body;
        const response = await AuthService.login(email, password, fcmToken);
        res.status(response.code).json(response);
    });

    public sendOtp = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const { email } = req.body;
        const response = await AuthService.sendOtp(email);
        res.status(response.code).json(response);
    });

    public verifyOtp = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const { email, otp } = req.body;
        const response = await AuthService.verifyOtp(email, otp);
        res.status(response.code).json(response);
    });

    public resetPassword = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const { password } = req.body;
        const user = req.user;

        if (!user) {
            return res.status(400).json({
                code: 400,
                status: false,
                msg: "User not found"
            });
        }

        const response = await AuthService.resetPassword(user.id, password);
        res.status(response.code).json(response);
    });
}

export default new AuthController();
