import { Router } from "express";
import { EUserRole } from "../interface/enum";
import authMiddleware from "../middlewares/auth.middleware";
import { CalendarController } from "../controllers/calender.controller";

export default class CalenderAPI {
  private CalendarController: CalendarController;

  constructor(private readonly router: Router) {
    this.router = Router();
    this.CalendarController = new CalendarController();
    this.setupRoutes(); 
  }

  setupRoutes() {
    this.router.get(
      "/",
      authMiddleware(Object.values(EUserRole)),
      this.CalendarController.index
    );

    this.router.post(
      "/",
      authMiddleware(Object.values(EUserRole)),
      this.CalendarController.create
    );

    this.router.delete(
      "/:id",
      authMiddleware(Object.values(EUserRole)),
      this.CalendarController.delete
    );
  }

  getRouter() {
    return this.router;
  }

  getRouterGroup() {
    return "/calender";
  }
}
