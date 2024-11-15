import { Router } from "express";
import { EUserRole } from "../interface/enum";
import authMiddleware from "../middlewares/auth.middleware";
import LikeController from "../controllers/like.controller";

export default class LikeAPI {

    private LikeController:LikeController
    
    constructor(private readonly router: Router) {
        this.router = Router();
        this.LikeController = new LikeController();
        this.setupRoutes();
    }

    setupRoutes() {
        this.router.put("/",authMiddleware(Object.values(EUserRole)),this.LikeController.create)
    }

    getRouter() {
        return this.router;
    }

    getRouterGroup() {
        return '/like';
    }
}