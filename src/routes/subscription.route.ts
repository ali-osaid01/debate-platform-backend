import { Router } from "express";
import SubscriptionController from "../controllers/subscription.controller";
import { EUserRole } from "../interface/enum";
import authMiddleware from "../middlewares/auth.middleware";

export default class SubscriptionAPI {
    private SubscriptionController: SubscriptionController
    constructor(private readonly router: Router) {
        this.SubscriptionController = new SubscriptionController();
        this.router = Router();
        this.setupRoutes();
    }

    setupRoutes() {

        this.router.get('/',
                  authMiddleware(Object.values(EUserRole)),
            this.SubscriptionController.index
        );

        this.router.post('/',
            authMiddleware(Object.values(EUserRole)),
            this.SubscriptionController.create
        );
    }

    getRouter() {
        return this.router;
    }

    getRouterGroup() {
        return '/subscription';
    }
}