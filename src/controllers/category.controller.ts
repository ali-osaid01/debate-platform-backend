import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../utils/helpers";
import CategoryService from "../services/category.service";
import { ICategory } from "../interface/category.interface";
import { IUser } from "../interface/user.interface";
class CategoryController {
    private CategoryService:CategoryService

    constructor() {this.CategoryService = new CategoryService()}
    
    public index = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        let {page = 1,limit = 10 } = req.query;
        const query:Partial<ICategory> = {isDeleted:false}
        const response = await this.CategoryService.index(page as number,limit as number,query )
        res.status(response.code).json(response);
    })

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
}

export default CategoryController;
