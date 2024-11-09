import { PipelineStage } from "mongoose";
import { eventRepository, notificationRepository } from ".";
import { ApiResponse } from "../interface";
import { ApprovalStatus, ENOTIFICATION_TYPES, ParticipantStatus } from "../interface/enum";
import { IEvent } from "../interface/event.interface";
import Response from "../utils/response";

class EventService {
    private Response: Response;

    constructor() { this.Response = new Response() }

    index = async (filter: Partial<IEvent>, page: number, limit: number): Promise<ApiResponse> => {
        try {
            const query:PipelineStage[] = [];
            
            query.push({
                $lookup: {
                    from: 'users',
                    localField: 'postedBy',
                    foreignField: '_id',
                    as: 'postedBy',
                    pipeline: [
                        {
                            $project: {
                                _id: 1,
                                name: 1,
                                email: 1,
                                profilePicture: 1
                            }
                        }
                    ]
                }
            });
            
            query.push({
                $lookup: {
                    from: 'users',
                    localField: 'participants.user',  
                    foreignField: '_id',         
                    as: 'attendees',                   
                    pipeline: [
                        {
                            $project: {
                                _id: 1,
                                name: 1,
                                email: 1,
                                profilePicture: 1
                            }
                        }
                    ]
                }
            });
            
            const events = await eventRepository.getAllAggregated({page,limit,query});
            return this.Response.sendSuccessResponse("Events Fetch Successfully", events);
        } catch (error) {
            return this.Response.sendResponse(500, { msg: "Something went wrong", error });
        }
    };

    create = async (data: Partial<IEvent>): Promise<ApiResponse> => {
        try {
            const event = await eventRepository.create(data);
            return this.Response.sendResponse(201, { msg: "Event created successfully", event });
        } catch (error) {
            return this.Response.sendResponse(500, { msg: "Error creating event", error });
        }
    };

    update = async (id: string, data: Partial<IEvent>): Promise<ApiResponse> => {
        try {
            const updatedEvent = await eventRepository.updateById(id, data);
            return this.Response.sendResponse(200, { msg: "Event updated successfully", event: updatedEvent });
        } catch (error) {
            return this.Response.sendResponse(500, { msg: "Error updating event", error });
        }
    };

    delete = async (id: string): Promise<ApiResponse> => {
        try {
            const event = await eventRepository.deleteOne({ _id: id });
            if (!event) return this.Response.sendResponse(404, "Event Not Found")
            return this.Response.sendSuccessResponse("Event Successfully Deleted", event);
        } catch (error) {
            return this.Response.sendResponse(500, { msg: "Error deleting event", error });
        }
    };

    toggleEvent = async (id: string, status: string, user: string): Promise<ApiResponse> => {
        try {
            const event = await eventRepository.updateById(id, { approvalStatus: status });

            if (!event) return this.Response.sendResponse(404, { msg: "Event not found" });

            const isApproved = status === ApprovalStatus.APPROVED;
            const notificationTitle = isApproved ? "Event Approved" : "Event Rejected";
            const notificationContent = isApproved ? "Admin has approved the event." : "Admin has rejected the event.";
            const notificationType = isApproved ? ENOTIFICATION_TYPES.EVENT_ACCEPTED : ENOTIFICATION_TYPES.EVENT_REJECTED;
            
            await notificationRepository.create({
                receiver: event.postedBy as string,
                sender: user,
                title: notificationTitle,
                content: notificationContent,
                type: notificationType
            });

            if (isApproved && Array.isArray(event.participants) && event.participants.length > 0) {
                for (const participant of event.participants) {
                    await notificationRepository.create({
                        receiver: participant.user as string,
                        sender: event.postedBy as string,
                        title: "Event Invitation",
                        content: `${event.postedBy} has invite you to join the event for debate on ${event.title}`,
                        type: ENOTIFICATION_TYPES.EVENT_ACCEPTED
                    });
                }
            }

            return this.Response.sendSuccessResponse( 
             "Event Status Updated Successfully",
             event
            );
            
        } catch (error) {
            console.error("Error toggling event status:", error);
            return this.Response.sendResponse(500, {
                msg: "Error updating event",
                error
            });
        }
    };

    toggleUserStatus = async (user: string, id: string, status: ParticipantStatus): Promise<ApiResponse> => {
        try {
            const event = await eventRepository.updateById(id, {
                $set: {
                    "participants.$[elem].status": status
                }
            }, {
                arrayFilters: [{ "elem.user": user }]
            });
    
            if (!event) return this.Response.sendResponse(404, { msg: "Event not found" });
            const content = `Participant has ${status === 'confirmed' ? 'accepted' : 'rejected'} your invite for ${event.title}`;
    
            await notificationRepository.create({
                receiver: event?.postedBy as string,  
                sender: user as string,
                title: `Participant has ${status === 'confirmed' ? 'accepted' : 'rejected'} your Invite for ${event.title}`,
                content: content, 
            });
    
            return this.Response.sendSuccessResponse("Event status updated and notification sent", event);
        } catch (error) {
            console.error("Error toggling user status:", error);
            return this.Response.sendResponse(500, { msg: "Error updating event status", error });
        }
    };
}

export default EventService;
