import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware";
import userController from "../controllers/user.controller";
import { EUserRole } from "../interface/enum";

export default class UserAPI {
    constructor(private readonly router: Router) {
        this.router = Router();
        this.setupRoutes();
    }

    setupRoutes() {
        this.router.get('/', authMiddleware(Object.values(EUserRole)), userController.fetchAllUsers);
        this.router.get('/profile', authMiddleware(Object.values(EUserRole)), userController.fetchUser);
    }

    getRouter() {
        return this.router;
    }

    getRouterGroup() {
        return '/user';
    }
}