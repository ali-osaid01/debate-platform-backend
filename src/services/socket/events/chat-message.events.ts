import { Server } from "socket.io";
import { CustomSocket } from "../../../interface";
import { SOCKET_EVENTS } from "../../../interface/enum";
import { messageRepository } from "../..";
import { PipelineStage } from "mongoose";

export const fetchChatMessage = async (socket: CustomSocket, io: Server) => {
    socket.on(SOCKET_EVENTS.CHAT_MESSAGE_LIST, async (payload: { chat: string,limit:number,page:number }) => {
        const {chat,limit,page} = payload

        const pipeline: PipelineStage[] = []
        pipeline.push({$match: {chat}});
        const messages = await messageRepository.getAllAggregated({limit,page});
        socket.emit(SOCKET_EVENTS.CHAT_MESSAGE_LIST, messages);
    });
}