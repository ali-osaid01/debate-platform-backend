import { userRepository } from "../services";
import { IUser } from "../interface/user.interface";
import { ApiResponse } from "../interface";
import Response from "../utils/response";  

class UserService {
    private Response:Response
    constructor(){   this.Response = new  Response()}

    public async index(query:Partial<IUser>,page:number,limit:number):Promise<ApiResponse> {
        try {
            const users = await userRepository.getAll({query,page,limit})
            return this.Response.sendSuccessResponse("Users Fetch Successfully",users);
        } catch (error) {
            return this.Response.sendResponse(500, { msg: "Something went wrong", error });
        }
    }

    public async update (id:string,payload:IUser):Promise<ApiResponse> {
        try {
            const users = await userRepository.updateById(id,payload)
            return this.Response.sendSuccessResponse("Users Fetch Successfully",{users});
        } catch (error) {
            return this.Response.sendResponse(500, { msg: "Something went wrong", error });
        }
    }
    public async authenticatedUser (id:string):Promise<ApiResponse> {
        try {
            const user = await userRepository.getById(id)
            if(!user) return this.Response.sendResponse(401,"Unauthorized access")
            return this.Response.sendSuccessResponse("Users Fetch Successfully",user );
        } catch (error) {
            return this.Response.sendResponse(500, { msg: "Something went wrong", error });
        }
    }
    
}

export default UserService
