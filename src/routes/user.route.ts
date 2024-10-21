import { Router } from "express";
import { ROLES } from "../utils/constants";
import authMiddleware from "../middlewares/auth.middleware";
import userController from "../controllers/user.controller";

export default class UserAPI {
    constructor(private readonly router: Router) {
        this.router = Router();
        this.setupRoutes();
    }

    setupRoutes() {
        this.router.get('/', authMiddleware(Object.values(ROLES)), userController.fetchAllUsers);
        this.router.get('/profile', authMiddleware(Object.values(ROLES)), userController.fetchUser);
    }

    getRouter() {
        return this.router;
    }

    getRouterGroup() {
        return '/user';
    }
}