import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware";
import { EUserRole } from "../interface/enum";
import UserController from "../controllers/user.controller";

export default class UserAPI {
    constructor(private readonly router: Router) {
        this.router = Router();
        this.setupRoutes();
    }

    setupRoutes() {
        
        this.router.get('/', 
        authMiddleware(Object.values(EUserRole)),
        UserController.index);

    }

    getRouter() {
        return this.router;
    }

    getRouterGroup() {
        return '/user';
    }
}