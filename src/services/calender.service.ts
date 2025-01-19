import { ApiResponse } from "../interface";
import { ICalendar } from "../interface/calender.interface";
import Response from "../utils/response";
import { PipelineStage } from "mongoose";
import { calendarRepository } from "./index";

class CalendarService {
    private Response: Response;

    constructor() {
        this.Response = new Response();
    }

    create = async (payload: ICalendar): Promise<ApiResponse> => {
        const isEventExist = await calendarRepository.getOne({
            event: payload.events,
            creator: payload.creator,
        });
        if (isEventExist)
            return this.Response.sendResponse(409, "Event already exists");

        const event = await calendarRepository.create(payload);
        return this.Response.sendSuccessResponse(
            "Event successfully created",
            event
        );
    };

    index = async (page: number, limit: number, pipeline: PipelineStage[]) => {
        pipeline.push(
            {
                $lookup: {
                    from: "events",
                    localField: "events",
                    foreignField: "_id",
                    as: "event",
                    pipeline: [
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
                                            username: 1,
                                            profilePicture: 1
                                        },
                                      
                                    },
                                ]
                            },
                        },
                        {
                            $unwind:{
                                path: "$postedBy",
                                preserveNullAndEmptyArrays: true
                            }
                        }
                    ]
                }
            },
            {
                $unwind: {
                    path: "$event",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $unwind: {
                    path: "$creator",
                    preserveNullAndEmptyArrays: true
                }
            },
        );
    
        const result = await calendarRepository.getAllAggregated({
            query: pipeline,
            page,
            limit,
        });
    
        return this.Response.sendSuccessResponse(
            "Events fetched successfully",
            result
        );
    };

    delete = async (id: string) => {
        const result = await calendarRepository.deleteOne({ _id: id });
        if (!result) return this.Response.sendResponse(404, "Event not found");
        return this.Response.sendSuccessResponse(
            "Event deleted successfully",
            result
        );
    };
}

export default CalendarService;