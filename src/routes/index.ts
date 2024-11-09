import { Request, Response, NextFunction, Application, Router } from "express";

import RootAPI from "./root.route";
import AuthAPI from "./auth.route";
import UserAPI from "./user.route";
import EventAPI from "./event.route";
import NotificationAPI from "./notification.route";
import MediaAPI from "./media.route";
import LikeAPI from "./like.route";

export default class API {
    router: Router;
    routeGroups: any[];

    constructor(private readonly app: Application) {
        this.router = Router();
        this.routeGroups = [];
    }

    loadRouteGroups() {
        const routeGroups = this.routeGroups;
        const router = this.router;

        routeGroups.push(new RootAPI(router));
        routeGroups.push(new AuthAPI(router));
        routeGroups.push(new UserAPI(router));
        routeGroups.push(new EventAPI(router))
        routeGroups.push(new NotificationAPI(router));
        routeGroups.push(new MediaAPI(router));
        routeGroups.push(new LikeAPI(router));
    }

    setContentType(req: Request, res: Response, next: NextFunction) {
        res.set("Content-Type", "application/json");
        next();
    }

    registerGroups() {
        this.loadRouteGroups();
        this.routeGroups.forEach((rg) => {
            console.log("Route group: " + rg.getRouterGroup());
            this.app.use("/api" + rg.getRouterGroup(), this.setContentType, rg.getRouter());
        });
    }
}