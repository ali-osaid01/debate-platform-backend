import { eventRepository } from ".";  // Assuming this contains the repository methods like getAll, create, update, delete
import { ApiResponse } from "../interface";
import { IEvent } from "../interface/event.interface";
import Response from "../utils/response";

class EventService {

    private Response: Response;

    constructor() {
        this.Response = new Response();
    }

    // Fetch all events with pagination and filtering
    index = async (filter: Partial<IEvent>, page: number, limit: number): Promise<ApiResponse> => {
        try {
            const events = await eventRepository.getAll({ query: filter, page, limit });
            return this.Response.sendResponse(200, events);
        } catch (error) {
            return this.Response.sendResponse(500, { msg: "Something went wrong", error });
        }
    };

    // Create a new event
    create = async (data: Partial<IEvent>): Promise<ApiResponse> => {
        try {
            // Create the event by passing data to the repository
            const event = await eventRepository.create(data);
            return this.Response.sendResponse(201, { msg: "Event created successfully", event });
        } catch (error) {
            return this.Response.sendResponse(500, { msg: "Error creating event", error });
        }
    };

    // Update an existing event
    update = async (id: string, data: Partial<IEvent>): Promise<ApiResponse> => {
        try {
            const event = await eventRepository.getById(id);
            if (!event) {
                return this.Response.sendResponse(404, { msg: "Event not found" });
            }

            const updatedEvent = await eventRepository.updateById(id, data);
            return this.Response.sendResponse(200, { msg: "Event updated successfully", event: updatedEvent });
        } catch (error) {
            return this.Response.sendResponse(500, { msg: "Error updating event", error });
        }
    };

    delete = async (id: string): Promise<ApiResponse> => {
        try {
            const event = await eventRepository.getById(id);
            if (!event) {
                return this.Response.sendResponse(404, { msg: "Event not found" });
            }
            await eventRepository.deleteOne({ _id: id });
            return this.Response.sendResponse(200, { msg: "Event deleted successfully" });
        } catch (error) {
            return this.Response.sendResponse(500, { msg: "Error deleting event", error });
        }
    };
}

export default EventService;
