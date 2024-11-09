import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware";
import { EUserRole } from "../interface/enum";
import UserController from "../controllers/user.controller";

export default class UserAPI {
    private UserController:UserController
    constructor(private readonly router: Router) {
        this.router = Router();
        this.UserController = new UserController();
        this.setupRoutes();
    }

    setupRoutes() {
        
        this.router.get('/', 
        authMiddleware(Object.values(EUserRole)),
        this.UserController.index);

    }

    getRouter() {
        return this.router;
    }

    getRouterGroup() {
        return '/user';
    }
}