import { ApiResponse } from "../interface";
import { ICategory } from "../interface/category.interface";
import { categoryRepository } from "./index";
import Response from "../utils/response";

class CategoryService {
    private Response: Response;

    constructor() { this.Response = new Response() }

    create = async (payload:ICategory):Promise<ApiResponse> => {
        const isCategoryExist = await categoryRepository.getOne({title:payload.title});
        if(isCategoryExist) return this.Response.sendResponse(409,"Category already Exist");

        const category = await categoryRepository.create(payload);
        return this.Response.sendSuccessResponse("Category Successfully Created",category);
    }

    index = async (page:number,limit:number,filter:Partial<ICategory>) => {  
        const result = await categoryRepository.getAll({query:filter,page,limit});
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
