import { Router } from "express";
import userController from "../controllers/user.controller";

export default class AuthAPI {
    constructor(private readonly router: Router) {
        this.router = Router();
        this.setupRoutes();
    }

    setupRoutes() {
        this.router.post('/register', userController.register);
        this.router.post('/login', userController.login);
    }

    getRouter() {
        return this.router;
    }

    getRouterGroup() {
        return '/auth';
    }
}