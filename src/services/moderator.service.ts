import { userRepository } from ".";
import { ApiResponse } from "../interface";
import { IUser } from "../interface/user.interface";
import Response from "../utils/response";

class ModeratorService {
    private Response: Response;

    constructor() { this.Response = new Response(); }

    create = async (payload: Partial<IUser>) => {
        try {
            const [existingUser, isUsernameAlreadyExist] = await Promise.all([
                userRepository.getOne({ email: payload.email, isDeleted: false }).lean(),
                userRepository.getOne({ username: payload.username,isDeleted:false }).lean()
            ]);
            
            if (isUsernameAlreadyExist) return this.Response.sendResponse(400, "Username already exists");
            if (existingUser) return this.Response.sendResponse(400, "User already exists");  
            
            const newUser = await userRepository.create(payload);
            return this.Response.sendSuccessResponse("User created successfully", newUser);
        } catch (error) {
            console.error(error);
            return this.Response.sendResponse(500, "Something went wrong");
        }
    }

    index = async (filter: Partial<IUser>, page: number, limit: number): Promise<ApiResponse> => {
        try {
            const user = await userRepository.getAll({ query: filter, page, limit }); 
            return this.Response.sendSuccessResponse("Moderator fetched successfully", user);
        } catch (error) {
            return this.Response.sendResponse(500, { msg: "Something went wrong", error });
        }
    }
}

export default ModeratorService;