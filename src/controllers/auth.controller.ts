// user.controller.ts
import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../utils/helpers";
import AuthService from "../services/auth.service";
import { setAccessTokenCookie } from "../utils/cookies";

class AuthController {
    private AuthService:AuthService
    constructor(){
        this.AuthService = new AuthService()
    }
    public register = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const body = req.body;
        const response = await this.AuthService.register(body);
        res.status(response.code).json(response);
    });

    public login = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const { email, password, fcmToken } = req.body;
        const response = await this.AuthService.login(email, password, fcmToken);
        
        // if(response.code == 200) setAccessTokenCookie(res, (response.data as { accessToken: string }).accessToken);
        res.status(response.code).json(response);
    });

    public sendOtp = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const { email } = req.body;
        const response = await this.AuthService.sendOtp(email);
        res.status(response.code).json(response);
    });

    public verifyOtp = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const { email, otp } = req.body;
        const response = await this.AuthService.verifyOtp(email, otp);
        res.status(response.code).json(response);
    });

    public resetPassword = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const { password } = req.body;
        const user = req.user;
        const response = await this.AuthService.resetPassword(user.id, password);
        res.status(response.code).json(response);
    });

    public googleAuth = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const { email, socialAuth, fcmToken,name,profilePicture } = req.body;
        const response = await this.AuthService.googleAuth(email,socialAuth,fcmToken,name,profilePicture);
        console.log("RESPONSE GOOGLE AUTH->",response)

        if(response.code == 200) setAccessTokenCookie(res, (response.data as { accessToken: string }).accessToken);
        res.status(response.code).json(response);
    });
}

export default  AuthController
