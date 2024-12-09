import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../utils/helpers";
import CategoryService from "../services/category.service";
import { ICategory } from "../interface/category.interface";
import { PipelineStage } from "mongoose";
import { FetchCategoriesPipeline } from "../database/pipeline/category.pipeline";
class CategoryController {
    private CategoryService: CategoryService

    constructor() { this.CategoryService = new CategoryService() }

    public index = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        let { page = 1, limit = 10 } = req.query;
        page = Number(page); 
        limit = Number(limit); 
    
        const pipeline = FetchCategoriesPipeline()
        const response = await this.CategoryService.index(page, limit, pipeline);
        res.status(response.code).json(response);
    });

    public delete = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        const response = await this.CategoryService.delete(id);
        res.status(response.code).json(response);
    })

    public create = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const payload = req.body;
        const response = await this.CategoryService.create(payload)
        res.status(response.code).json(response);
    })

    public createMany = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const payload = req.body.categories;
        const response = await this.CategoryService.createMany(payload)
        res.status(response.code).json(response);
    })
}

export default CategoryController;
