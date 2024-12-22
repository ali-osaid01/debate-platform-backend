import { chatRepository } from "../..";
import { CustomSocket } from "../../../interface";
import { SOCKET_EVENTS } from "../../../interface/enum";

export const fetchChats = (socket: CustomSocket): void => {
  socket.on(SOCKET_EVENTS.CHAT_LIST, async (data) => {
    try {
      if (!socket.user || !socket.user.id) {
        socket.emit("socket-error", "User not authenticated");
        return;
      }

      const limit = data?.limit || 15;
      const page = data?.page || 1;    
      const query = { participants: { $in: [socket.user.id] } };

      // Get chats from the repository
      const chats = await chatRepository.getAll({
        limit,
        page,
        query,
        populate:[{path:'event',select:'title picture'}]
      });

      // Emit the chats to the client
      socket.emit(`${SOCKET_EVENTS.CHAT_LIST}-${socket.user.id}`, {chats:chats.data});
    } catch (error: any) {
      console.error("Error fetching chats:", error);
      socket.emit("socket-error", error?.message || "An error occurred while fetching chats");
    }
  });
};
