import { Router } from "express";
import eventController from "../controllers/event.controller";
import authMiddleware from "../middlewares/auth.middleware";
import { EUserRole } from "../interface/enum";

export default class EventAPI {
    constructor(private readonly router: Router) {
        this.router = Router();
        this.setupRoutes();
    }

    setupRoutes() {
        this.router.get("/",
            authMiddleware(Object.values(EUserRole)),
            eventController.index
        )

        this.router.post("/",
            authMiddleware(Object.values(EUserRole)),
            eventController.create
        )

        this.router.put("/",
            authMiddleware(Object.values(EUserRole)),
            eventController.update
        )

        this.router.put("/toggle-status",
            authMiddleware(Object.values(EUserRole)),
            eventController.toggleEvent
        )
        this.router.put("/toggle-user-status",
            authMiddleware(Object.values(EUserRole)),
            eventController.toggleUserStatus
        )

        this.router.delete("/:id",
            authMiddleware(Object.values(EUserRole)),
            eventController.delete
        )
    }

    getRouter() {
        return this.router;
    }

    getRouterGroup() {
        return '/event';
    }
}