import { PipelineStage } from "mongoose";
import { chatRepository, messageRepository } from "../..";
import { CustomSocket } from "../../../interface";
import { SOCKET_EVENTS } from "../../../interface/enum";

export const fetchChatMessage = (socket: CustomSocket): void => {
  socket.on(SOCKET_EVENTS["FETCH-CHAT-MESSAGE"], async (data) => {
    try {
      if (!socket.user || !socket.user.id) {
        socket.emit("socket-error", "User not authenticated");
        return;
      }

      console.log("Fetching Message for user:", socket.user.id);
      
      const limit = data?.limit || 15;
      const page = data?.page || 1;    
      const query:PipelineStage[] = [];
      query.push({
        $match:{chat: data.chat}
      })
      
      const message = await messageRepository.getAllAggregated({
        limit,
        page,
        query,
      });

      socket.emit(`${SOCKET_EVENTS["FETCH-CHAT-MESSAGE"]}-${socket.user.id}`, {message:message.data});
    } catch (error: any) {
      console.error("Error fetching chats:", error);
      socket.emit("socket-error", error?.message || "An error occurred while fetching chats");
    }
  });
};
