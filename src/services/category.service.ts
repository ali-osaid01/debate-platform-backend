import { ApiResponse } from "../interface";
import { ICategory } from "../interface/category.interface";
import { categoryRepository } from "./index";
import Response from "../utils/response";
import { PipelineStage } from "mongoose";

class CategoryService {
    private Response: Response;

    constructor() { this.Response = new Response() }

    create = async (payload:ICategory):Promise<ApiResponse> => {
        const isCategoryExist = await categoryRepository.getOne({title:payload.title});
        if(isCategoryExist) return this.Response.sendResponse(409,"Category already Exist");

        const category = await categoryRepository.create(payload);
        return this.Response.sendSuccessResponse("Category Successfully Created",category);
    }

    createMany = async (payload: ICategory[]): Promise<ApiResponse> => {
        const createdCategories = await categoryRepository.createMany(payload); // Bulk create new categories
        return this.Response.sendSuccessResponse("Categories successfully created", createdCategories);
    };

    index = async (page:number,limit:number,filter:PipelineStage[]) => {  
        const result = await categoryRepository.getAllAggregated({query:filter,page,limit});
        if(result.data.length == 0) return this.Response.sendResponse(404,"Category Not Found")
        return this.Response.sendSuccessResponse("category fetch successfully",result);
    }

    show = async (id:string) => {  
        const result = await categoryRepository.getAll({query:{parent:id}});
        if(!result) return this.Response.sendResponse(404,"Category Not Found")
        return this.Response.sendSuccessResponse("category fetch successfully",result);
    }

    delete = async (id:string) => {  
        const result = await categoryRepository.updateById(id,{isDeleted:true})
        if(!result) return this.Response.sendResponse(404,"Category Not Found")
        return this.Response.sendSuccessResponse("category Delete successfully",result);
    }     
}

export default CategoryService;
