import { Router } from "express";
import userController from "../controllers/user.controller";
import { Validation } from "../middlewares/validation.middleware";

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
            userController.login);
    }

    getRouter() {
        return this.router;
    }

    getRouterGroup() {
        return '/auth';
    }
}