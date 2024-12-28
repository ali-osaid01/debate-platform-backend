import { Router } from "express";
import { EUserRole } from "../interface/enum";
import authMiddleware from "../middlewares/auth.middleware";
import CalendarController from "../controllers/calender.controller";

export default class CalenderAPI {
    private calendarController: CalendarController;
  constructor(private readonly router: Router) {
    this.router = Router();
    this.setupRoutes();
    this.calendarController = new CalendarController();
  }

  setupRoutes() {
    this.router.get(
      "/",
      authMiddleware(Object.values(EUserRole)),
      this.calendarController.index
    );
  
    this.router.post(
      "/",
      authMiddleware(Object.values(EUserRole)),
      this.calendarController.create
    );
    
    this.router.delete(
      "/:id",
      authMiddleware(Object.values(EUserRole)),
      this.calendarController.delete
    );
  }

  getRouter() {
    return this.router;
  }

  getRouterGroup() {
    return "/calender";
  }
}
