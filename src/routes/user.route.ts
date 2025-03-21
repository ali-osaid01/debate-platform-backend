import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware";
import { EUserRole } from "../interface/enum";
import UserController from "../controllers/user.controller";

export default class UserAPI {
    private UserController:UserController
    constructor(private readonly router: Router) {
        this.router = Router();
        this.UserController = new UserController();
        this.setupRoutes();
    }

    setupRoutes() {
        
        this.router.get('/', 
            authMiddleware(Object.values(EUserRole)),
            this.UserController.index);
        
        this.router.put('/', 
            authMiddleware(Object.values(EUserRole)),
            this.UserController.update);

        this.router.get('/authenticated', 
            authMiddleware(Object.values(EUserRole)),
            this.UserController.authenticatedUser);

        this.router.delete('/:id',
            authMiddleware(Object.values(EUserRole)),
            this.UserController.deleteUser);
        
            this.router.post('/toggle-status/:id',
            authMiddleware(Object.values(EUserRole)),
            this.UserController.toggleUser);

    }

    getRouter() {
        return this.router;
    }

    getRouterGroup() {
        return '/user';
    }
}