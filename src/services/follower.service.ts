import { followRepository, notificationRepository, userRepository } from "./index";
import { ApiResponse } from "../interface";
import Response from "../utils/response";
import { ENOTIFICATION_TYPES } from "../interface/enum";

class FollowService {
    private Response: Response;

    constructor() { this.Response = new Response() }

    create = async (follower: string, followed: string, user: string): Promise<ApiResponse> => {
        try {
            const existingFollow = await followRepository.getOne({ follower, followed });
    
            if (existingFollow) {
              await Promise.all([
                    followRepository.deleteOne({ follower, followed }),
    
                    userRepository.updateById(follower, { $inc: { followingCount: -1 } }),
                    userRepository.updateById(followed , { $inc: { followersCount: -1 } }),
    
                    notificationRepository.create({
                        sender: follower,
                        receiver: followed,
                        title: `${user} has unfollowed you`,
                        content: `${user} has unfollowed you`,
                        type: ENOTIFICATION_TYPES.UN_FOLLOW,
                    }),
                ]); 

                return this.Response.sendSuccessResponse("Unfollowed successfully", { follow: false });
            }
    
            await Promise.all([
                followRepository.create({ follower, followed }),
    
                userRepository.updateById(follower, { $inc: { followingCount: 1 } }),
                userRepository.updateById(followed, { $inc: { followerCount: 1 } }),
    
                notificationRepository.create({
                    sender: follower,
                    receiver: followed,
                    title: "New Follower",
                    content: `${user} has started following you.`,
                    type: ENOTIFICATION_TYPES.FOLLOW,
                }),
            ]);
    
            return this.Response.sendSuccessResponse("User followed successfully", { follow: true });
        } catch (error) {
            return this.Response.sendResponse(500, { msg: "Something went wrong", error });
        }
    };
    

    getOne = async (follower: string, followed: string): Promise<ApiResponse> => {
        try {
            const follow = await followRepository.getOne({ follower, followed });
            if (!follow) {
                return this.Response.sendSuccessResponse("Not Followed",{isFollowing:false});
            }
            return this.Response.sendSuccessResponse("Not Followed",{isFollowing:true});
        } catch (error) {
            return this.Response.sendResponse(500, { msg: "Something went wrong", error });
        }
    };
}

export default FollowService;
