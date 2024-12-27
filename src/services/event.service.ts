import mongoose, { PipelineStage } from "mongoose";
import { chatRepository, eventRepository, notificationRepository, userRepository } from ".";
import { ApiResponse } from "../interface";
import {
  ApprovalStatus,
  ENOTIFICATION_TYPES,
  ParticipantStatus,
  SOCKET_EVENTS,
} from "../interface/enum";
import { IEvent } from "../interface/event.interface";
import Response from "../utils/response";
import server from "..";
import { IChat } from "../interface/chat.interface";

class EventService {
  private Response: Response;
  constructor() {
    this.Response = new Response();

  }

  index = async (
    query: PipelineStage[],
    page: number,
    limit: number,
    user?:string
  ): Promise<ApiResponse> => {
    try {

      query.push(
        {
          $sample: {
            size: limit,
          },
        },
        {
          
          $lookup: {
            from: "users",
            localField: "postedBy",
            foreignField: "_id",
            as: "postedBy",
            pipeline: [
              {
                $project: {
                  _id: 1,
                  name: 1,
                  email: 1,
                  profilePicture: 1,
                },
              },
            ],
          },
        },
        {
          $addFields: {
            postedBy: { $arrayElemAt: ["$postedBy", 0] },
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "participants.user",
            foreignField: "_id",
            as: "participantUsers",
          },
        },
        
        {
          $addFields: {
            participants: {
              $map: {
                input: "$participants",
                as: "participant",
                in: {
                  $mergeObjects: [
                    "$$participant",
                    {
                      user: {
                        $arrayElemAt: [
                          {
                            $filter: {
                              input: "$participantUsers",
                              as: "u",
                              cond: { $eq: ["$$u._id", "$$participant.user"] }
                            }
                          },
                          0
                        ]
                      }
                    }
                  ]
                }
              }
            }
          }
        },
        {
          $project: {
            participantUsers: 0
          }
        },
        {
          $lookup: {
            from: "likes",
            localField: "_id",
            foreignField: "event",
            pipeline: [
              {
                $match: {
                  status: true
                }
              },
              {
                $group: {
                  _id: null,
                  totalLikes: { $sum: 1 },
                  userLiked: {
                    $sum: {
                      $cond: [
                        { $eq: ["$user", new mongoose.Types.ObjectId(user)] },
                        1,
                        0
                      ]
                    }
                  }
                }
              },
              {
                $project: {
                  _id: 0,
                  count: "$totalLikes",
                  isLiked: { $gt: ["$userLiked", 0] }
                }
              }
            ],
            as: "likes"
          }
        },
        {
          $addFields: {
            likeCount: { 
              $ifNull: [{ $arrayElemAt: ["$likes.count", 0] }, 0] 
            },
            isLiked: { 
              $ifNull: [{ $arrayElemAt: ["$likes.isLiked", 0] }, false] 
            }
          }
        },
        {
          $project: {
            likes: 0
          }
        }
      
        
      );

      // Execute the aggregation query
      const events = await eventRepository.getAllAggregated({
        page,
        limit,
        query,
      });

      return this.Response.sendSuccessResponse(
        "Events Fetched Successfully",
        events
      );
    } catch (error) {
      return this.Response.sendResponse(500, {
        msg: "Something went wrong",
        error,
      });
    }
  };

  create = async (data: Partial<IEvent>, username: string): Promise<ApiResponse> => {
    try {
      const event = await eventRepository.create(data);
      await userRepository.updateById(data.postedBy as string, { $inc: { postCount: 1 } });
      if (
        Array.isArray(data?.participants) &&
        event?.participants.length > 0
      ) {
        for (const participant of data?.participants) {
          await notificationRepository.create({
            receiver: participant.user as string,
            sender: event?.postedBy as string,
            title: "Event Invitation",
            content: `${username} has invite you to join the event for debate on ${event?.title}`,
            type: ENOTIFICATION_TYPES.EVENT_INVITATION,
            metadata: event?._id as string,
          });
        }
      }
      await chatRepository.create({
        name: event?.title as string,
        event: event?._id as string,
        creator: event?.postedBy as string,
        participants: [event.postedBy as string],
      
      })

      return this.Response.sendResponse(201, {
        msg: "Event created successfully",
        event,
      });
    } catch (error) {
      return this.Response.sendResponse(500, {
        msg: "Error creating event",
        error,
      });
    }
  };

  update = async (id: string, data: Partial<IEvent>): Promise<ApiResponse> => {
    try {
      const updatedEvent = await eventRepository.updateById(id, data);
      return this.Response.sendResponse(200, {
        msg: "Event updated successfully",
        event: updatedEvent,
      });
    } catch (error) {
      return this.Response.sendResponse(500, {
        msg: "Error updating event",
        error,
      });
    }
  };

  delete = async (id: string): Promise<ApiResponse> => {
    try {
      const event = await eventRepository.deleteOne({ _id: id });
      if (!event) return this.Response.sendResponse(404, "Event Not Found");
      return this.Response.sendSuccessResponse(
        "Event Successfully Deleted",
        event,
      );
    } catch (error) {
      return this.Response.sendResponse(500, {
        msg: "Error deleting event",
        error,
      });
    }
  };

  toggleEvent = async (
    id: string,
    status: string,
    user: string,
  ): Promise<ApiResponse> => {
    try {
      const checkEvent = await eventRepository.getById(id);

      if (!checkEvent)
        return this.Response.sendResponse(404, { msg: "Event not found" });

      const event = await eventRepository.updateById(id, {
        approvalStatus: status,
      });

      const isApproved = status === ApprovalStatus.APPROVED;
      const notificationTitle = isApproved
        ? "Event Approved"
        : "Event Rejected";
      const notificationContent = isApproved
        ? "Admin has approved the event."
        : "Admin has rejected the event.";
      const notificationType = isApproved
        ? ENOTIFICATION_TYPES.EVENT_ACCEPTED
        : ENOTIFICATION_TYPES.EVENT_REJECTED;

      await notificationRepository.create({
        receiver: event?.postedBy as string,
        sender: user,
        title: notificationTitle,
        content: notificationContent,
        type: notificationType,
      });



      return this.Response.sendSuccessResponse(
        "Event Status Updated Successfully",
        event!,
      );
    } catch (error) {
      console.error("Error toggling event status:", error);
      return this.Response.sendResponse(500, {
        msg: "Error updating event",
        error,
      });
    }
  };

  toggleUserStatus = async (
    user: string,
    id: string,
    status: ParticipantStatus,
    notification:string
  ): Promise<ApiResponse> => {
    try {
      const event = await eventRepository.updateById(
        id,
        {
          $set: {
            "participants.$[elem].status": status,
          },
        },
        {
          arrayFilters: [{ "elem.user": user }],
        },
      );

      if (!event)
        return this.Response.sendResponse(404, { msg: "Event not found" });
      const content = `Participant has ${status === "confirmed" ? "accepted" : "rejected"} your invite for ${event.title}`;

      await Promise.all([
        notificationRepository.create({
          receiver: event?.postedBy as string,
          sender: user as string,
          title: `Participant has ${status === "confirmed" ? "accepted" : "rejected"} your Invite for ${event.title}`,
          content: content,
        }),

        notificationRepository.updateById(
          notification,
          {
            isRead: true
          }
        ),
       
      ]);

      if(status == ParticipantStatus.CONFIRMED){
        await chatRepository.updateOne({event:id},{
          $addToSet:{participants:user}
        })
      }
      return this.Response.sendSuccessResponse(
        "Event status updated and notification sent",
        event,
      );

    } catch (error) {
      console.error("Error toggling user status:", error);
      return this.Response.sendResponse(500, {
        msg: "Error updating event status",
        error,
      });
    }
  };
}

export default EventService;
