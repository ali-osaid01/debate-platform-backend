import { userRepository } from "."
import { ApiResponse } from "../interface";
import { EUserRole } from "../interface/enum";
import { IUser } from "../interface/user.interface";
import Response from "../utils/response";

class ModeratorService {
    private Response: Response;

    constructor() { this.Response = new Response() }

    create = async (payload:Partial<IUser>) => {
        try {
            const user = await userRepository.getOne({email: payload.email}).lean();
            if(user) return this.Response.sendResponse(400, { msg: "User already exists" });  
            
            const newUser = await userRepository.create(payload);
            return this.Response.sendSuccessResponse("User created successfully", newUser);
        } catch (error) {
            return this.Response.sendResponse(500, { msg: "Something went wrong", error });
        }
    }

    index = async (filter: Partial<IUser>, page: number, limit: number): Promise<ApiResponse> => {
        try {
            const user = await userRepository.getAll({ query: filter, page, limit}); 
            return this.Response.sendSuccessResponse("Moderator Fetch Successfully", user );
        } catch (error) {
            return this.Response.sendResponse(500, { msg: "Something went wrong", error });
        }
    }
}

export default ModeratorService;