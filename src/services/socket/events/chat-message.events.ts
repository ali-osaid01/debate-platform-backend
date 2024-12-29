import { Server } from "socket.io";
import { CustomSocket } from "../../../interface";
import { SOCKET_EVENTS } from "../../../interface/enum";
import { messageRepository } from "../..";
import { PipelineStage, Types } from "mongoose";

export const fetchChatMessage = async (socket: CustomSocket, io: Server) => {
    socket.on(SOCKET_EVENTS["FETCH-CHAT-MESSAGE"], async (payload: { chat: string, limit: number, page: number }) => {
        const { chat, limit, page } = payload
        const pipeline: PipelineStage[] = []

        pipeline.push({ $match: { chat: new Types.ObjectId(chat) } });
        pipeline.push({
            $lookup: {
                from: "users",
                localField: "sender",
                foreignField: "_id",
                as: "sender",
                pipeline: [
                    {
                        $project: {
                            _id: 1,
                            name: 1,
                            profilePicture: 1,
                            username: 1
                        }
                    }
                ]
            }
        })
        pipeline.push({ $unwind: "$sender" });
        // pipeline.push({ $sort: { createdAt: -1 } });
        const messages = await messageRepository.getAllAggregated({ limit, page, query: pipeline });
        socket.emit(`${SOCKET_EVENTS["FETCH-CHAT-MESSAGE"]}-${payload.chat}`, messages);
    });
}