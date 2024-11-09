import { ILike } from "../interface/like.interface"; 
import { ApiResponse } from "../interface"; 
import Response from "../utils/response";
import { likeRepository } from ".";

class LikeService {
    private Response: Response;

    constructor() {
        this.Response = new Response(); 
    }

    public toggleLike = async (user: string, event: string): Promise<ApiResponse> => {
        try {
            const existingLike = await likeRepository.getOne({ user,event });
    
            if (existingLike) {
                const status = existingLike.status === true ? false : true;
                const like = await likeRepository.updateOne(
                    { user,event }, 
                    { status } 
                );
                return this.Response.sendSuccessResponse("Like toggled successfully", {like});
            }
            const payload = { user, event};
            const like = await likeRepository.create(payload);
            return this.Response.sendSuccessResponse("Like added successfully", {like});
        } catch (error) {
            console.error('Error toggling like:', error);
            return this.Response.sendResponse(500, { msg: "Error toggling like", error });
        }
    };
}

export default LikeService;
