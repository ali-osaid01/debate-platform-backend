import { Server } from "socket.io";
import { CustomSocket } from "../../../interface";
import { SOCKET_EVENTS } from "../../../interface/enum";
import { IUser } from "../../../interface/user.interface";
import { chatRepository } from "../..";

export const removeParticipants = async (socket: CustomSocket, io: Server) => {
  socket.on(SOCKET_EVENTS["USER-LEAVE"], async (payload: { user: IUser; chat: string }) => {
    
    try {
      const updatedChat = await chatRepository.updateById(
        payload.chat,
        { $pull: { participants: payload.user.id } }
      );

      if (!updatedChat) {
        console.error(`Chat with ID ${payload.chat} not found.`);
        return;
      }

      socket.leave(payload.chat);
      console.log(`User ${payload.user.id} removed from room ${payload.chat}`);

      io.to(payload.chat).emit(SOCKET_EVENTS["USER-LEAVE"], {
        user: payload.user,
        chat: payload.chat,
      });
    } catch (error) {
      console.error("Error removing participant:", error);
    }
  });
};
