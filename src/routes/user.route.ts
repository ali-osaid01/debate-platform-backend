import { Router } from "express";

export default class UserAPI {
    constructor(private readonly router: Router) {
        this.router = Router();
        this.setupRoutes();
    }

    setupRoutes() {
        // this.router.get('/', authMiddleware(Object.values(EUserRole)), userController.fetchAllUsers);
        
        // this.router.get('/', 
        // authMiddleware(Object.values(EUserRole)),
        // userController.fetchUser);
    }

    getRouter() {
        return this.router;
    }

    getRouterGroup() {
        return '/user';
    }
}