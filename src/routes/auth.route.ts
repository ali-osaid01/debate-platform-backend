import { Router } from "express";
import { Validation } from "../middlewares/validation.middleware";
import { EUserRole } from "../interface/enum";
import AuthController from "../controllers/auth.controller";
import authMiddleware from "../middlewares/auth.middleware";

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
            AuthController.register
        );

        this.router.post('/login',
            this.validateRequest,
            AuthController.login
        );

        this.router.put('/send-otp',
            this.validateRequest,
            AuthController.sendOtp
        )

        this.router.put('/verify-otp',
            this.validateRequest,
            AuthController.verifyOtp
        )

        this.router.put('/reset-password',
            this.validateRequest,
            authMiddleware(Object.values(EUserRole)),
            AuthController.resetPassword
        )
    }

    getRouter() {
        return this.router;
    }

    getRouterGroup() {
        return '/auth';
    }
}