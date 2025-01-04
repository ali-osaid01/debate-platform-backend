import { ApiResponse } from "../interface";
import Response from "../utils/response";
import { eventRepository, likeRepository, notificationRepository } from ".";

class LikeService {
    private Response: Response;

    constructor() {
        this.Response = new Response();
    }

    public toggleLike = async (user: string, event: string): Promise<ApiResponse> => {
        try {
            // Validate if the event exists
            const eventDetails = await eventRepository.getOne({ _id: event });
            if (!eventDetails) {
                return this.Response.sendResponse(404, "Event not found");
            }

            // Check for existing like
            const existingLike = await likeRepository.getOne({ user, event });
            if (existingLike) {
                // Toggle like status
                const updatedLike = await likeRepository.updateOne(
                    { user, event },
                    { status: !existingLike.status }
                );
                return this.Response.sendSuccessResponse("Like toggled successfully", { like: updatedLike });
            }

            // Create a notification for the event owner
            await notificationRepository.create({
                receiver: eventDetails.postedBy as string,
                sender: user,
                title: `Someone liked your event "${eventDetails.title}"`,
                content: `Your event "${eventDetails.title}" received a like.`,
            });

            const newLike = await likeRepository.create({ user, event });
            return this.Response.sendSuccessResponse("Like added successfully", { like: newLike });
        } catch (error) {
            console.error('Error toggling like:', error);
            return this.Response.sendResponse(500, { msg: "Error toggling like", error });
        }
    };
}

export default LikeService;
