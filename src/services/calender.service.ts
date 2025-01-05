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

    index = async (page: number, limit: number, filter: any) => {
        const result = await calendarRepository.getAll({
            query: filter,
            page,
            limit,
            populate:[
                {
                    path: "events",
                },
                {
                    path: "creator",
                    select: "name profilePicture username",
                },
            ]
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