import { Router } from "express";
import { EUserRole } from "../interface/enum";
import authMiddleware from "../middlewares/auth.middleware";
import CategoryController from "../controllers/category.controller";

export default class CategoryAPI {
  private CategoryController;

  constructor(private readonly router: Router) {
    this.router = Router();
    this.CategoryController = new CategoryController();
    this.setupRoutes();
  }

  setupRoutes() {
    this.router.get(
      "/",
      authMiddleware(Object.values(EUserRole)),
      this.CategoryController.index,
    );
    this.router.get(
      "/show",
      authMiddleware(Object.values(EUserRole)),
      this.CategoryController.show,
    );
    this.router.post(
      "/",
      authMiddleware(Object.values(EUserRole)),
      this.CategoryController.create,
    );
    this.router.post(
      "/create-many",
      authMiddleware(Object.values(EUserRole)),
      this.CategoryController.createMany,
    );
    this.router.delete(
      "/:id",
      authMiddleware(Object.values(EUserRole)),
      this.CategoryController.delete,
    );
  }

  getRouter() {
    return this.router;
  }

  getRouterGroup() {
    return "/category";
  }
}
