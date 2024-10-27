import { Router } from "express";
import userController from "../controllers/user.controller";
import { Validation } from "../middlewares/validation.middleware";
import authMiddleware from "../middlewares/auth.middleware";
import { EUserRole } from "../interface/enum";

export default class AuthAPI {
    private validateRequest;
    constructor(private readonly router: Router) {
        this.router = Router();
        this.validateRequest = new Validation().reporter(true, "auth");
        this.setupRoutes();
    }

    setupRoutes() {
        this.router.post('/register',
            this.validateRequest,
            userController.register
        );

        this.router.post('/login',
            this.validateRequest,
            userController.login
        );

        this.router.put('/send-otp',
            this.validateRequest,
            userController.sendOtp
        )

        this.router.put('/verify-otp',
            this.validateRequest,
            userController.verifyOtp
        )

        this.router.put('/reset-password',
            this.validateRequest,
            authMiddleware(Object.values(EUserRole)),
            userController.resetPassword
        )
    }

    getRouter() {
        return this.router;
    }

    getRouterGroup() {
        return '/auth';
    }
}