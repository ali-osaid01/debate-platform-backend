import { Router } from "express";
import { Validation } from "../middlewares/validation.middleware";
import { EUserRole } from "../interface/enum";
import AuthController from "../controllers/auth.controller";
import authMiddleware from "../middlewares/auth.middleware";

export default class AuthAPI {
    private validateRequest;
    private AuthController:AuthController
    constructor(private readonly router: Router) {
        this.validateRequest = new Validation().reporter(true, "auth");
        this.AuthController = new AuthController();
        this.router = Router();
        this.setupRoutes();
    }

    setupRoutes() {

        this.router.post('/register',
            this.validateRequest,
            this.AuthController.register
        );

        this.router.post('/google-auth',
            this.validateRequest,
            this.AuthController.googleAuth
        )
        
        this.router.post('/login',
            this.validateRequest,
            this.AuthController.login
        );

        this.router.put('/send-otp',
            this.validateRequest,
            this.AuthController.sendOtp
        )

        this.router.put('/verify-otp',
            this.validateRequest,
            this.AuthController.verifyOtp
        )

        this.router.put('/reset-password',
            this.validateRequest,
            authMiddleware(Object.values(EUserRole)),
            this.AuthController.resetPassword
        )
   
    }

    getRouter() {
        return this.router;
    }

    getRouterGroup() {
        return '/auth';
    }
}