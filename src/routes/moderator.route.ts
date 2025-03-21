import { Router } from "express";
import { EUserRole } from "../interface/enum";
import authMiddleware from "../middlewares/auth.middleware";
import ModeratorController from "../controllers/moderator.controller";

export default class ModeratorAPI {

    private readonly ModeratorController: ModeratorController
    
    constructor(private readonly router: Router) {
        this.router = Router();
        this.ModeratorController = new ModeratorController();
        this.setupRoutes();
    }

    setupRoutes() {
        
        this.router.post("/",authMiddleware(Object.values(EUserRole)),this.ModeratorController.create)
        this.router.get("/",authMiddleware(Object.values(EUserRole)),this.ModeratorController.index)
    }

    getRouter() {
        return this.router;
    }

    getRouterGroup() {
        return '/moderator';
    }
}