import { Router } from "express";
import { EUserRole } from "../interface/enum";
import authMiddleware from "../middlewares/auth.middleware";

export default class ModeratorAPI {

    constructor(private readonly router: Router) {
        this.router = Router();
        this.setupRoutes();
    }

    setupRoutes() {
        
        // this.router.put("/",authMiddleware(Object.values(EUserRole)),this.LikeController.create)
    }

    getRouter() {
        return this.router;
    }

    getRouterGroup() {
        return '/moderator';
    }
}