import { Router } from "express";
import { EUserRole } from "../interface/enum";
import authMiddleware from "../middlewares/auth.middleware";
import FollowController from "../controllers/follower.controller";

export default class FollowAPI {

    private FollowController:FollowController
    
    constructor(private readonly router: Router) {
        this.router = Router();
        this.FollowController = new FollowController();
        this.setupRoutes();
    }

    setupRoutes() {
        this.router.put("/",authMiddleware(Object.values(EUserRole)),this.FollowController.create)
        this.router.get("/",authMiddleware(Object.values(EUserRole)),this.FollowController.isFollowed)
    }

    getRouter() {
        return this.router;
    }

    getRouterGroup() {
        return '/follow';
    }
}