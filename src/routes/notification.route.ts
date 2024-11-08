import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware";
import { EUserRole } from "../interface/enum";
import notificationController from "../controllers/notification.controller";

export default class NotificationAPI {
    constructor(private readonly router: Router) {
        this.router = Router();
        this.setupRoutes();
    }

    setupRoutes() {
        this.router.get("/",authMiddleware(Object.values(EUserRole)),notificationController.index)

    }

    getRouter() {
        return this.router;
    }

    getRouterGroup() {
        return '/notification';
    }
}