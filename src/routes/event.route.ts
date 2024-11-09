import { Router } from "express";
import EventController from "../controllers/event.controller";
import authMiddleware from "../middlewares/auth.middleware";
import { EUserRole } from "../interface/enum";

export default class EventAPI {
    private EventController:EventController
    constructor(private readonly router: Router) {
        this.router = Router();
        this.EventController = new EventController()
        this.setupRoutes();
    }

    setupRoutes() {
        this.router.get("/",
            authMiddleware(Object.values(EUserRole)),
            this.EventController.index
        )

        this.router.post("/",
            authMiddleware(Object.values(EUserRole)),
            this.EventController.create
        )

        this.router.put("/",
            authMiddleware(Object.values(EUserRole)),
            this.EventController.update
        )

        this.router.put("/toggle-status",
            authMiddleware(Object.values(EUserRole)),
            this.EventController.toggleEvent
        )
        this.router.put("/toggle-user-status",
            authMiddleware(Object.values(EUserRole)),
            this.EventController.toggleUserStatus
        )

        this.router.delete("/:id",
            authMiddleware(Object.values(EUserRole)),
            this.EventController.delete
        )
    }

    getRouter() {
        return this.router;
    }

    getRouterGroup() {
        return '/event';
    }
}