import { Router } from "express";
import { EUserRole } from "../interface/enum";
import authMiddleware from "../middlewares/auth.middleware";
import { BadgeController } from "../controllers/badge.controller";

export default class BadgeAPI {
    private BadgeController;

    constructor(private readonly router: Router) {
        this.router = Router();
        this.BadgeController = new BadgeController();
        this.setupRoutes();
    }

    setupRoutes() {
        this.router.get(
            "/",
            authMiddleware(Object.values(EUserRole)),
            this.BadgeController.index
        );

        this.router.post(
            "/",
            authMiddleware(Object.values(EUserRole)),
            this.BadgeController.create
        );

        this.router.put(
            "/:id",
            authMiddleware(Object.values(EUserRole)),
            this.BadgeController.update
        );

        this.router.put(
            "/manage/:user",
            authMiddleware(Object.values(EUserRole)),
            this.BadgeController.manageBadge
        );
    }

    getRouter() {
        return this.router;
    }

    getRouterGroup() {
        return "/badge";
    }
}
