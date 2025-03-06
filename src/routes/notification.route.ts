import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware";
import { EUserRole } from "../interface/enum";
import NotificationController from "../controllers/notification.controller";

export default class NotificationAPI {

    private NotificationController:NotificationController
    
    constructor(private readonly router: Router) {
        this.router = Router();
        this.NotificationController = new NotificationController();
        this.setupRoutes();
    }

    setupRoutes() {
        this.router.get(
            "/",authMiddleware(Object.values(EUserRole)),
        this.NotificationController.index
        )
        this.router.put(
            "/read",authMiddleware(Object.values(EUserRole)),
        this.NotificationController.update
        )
    }

    getRouter() {
        return this.router;
    }

    getRouterGroup() {
        return '/notification';
    }
}