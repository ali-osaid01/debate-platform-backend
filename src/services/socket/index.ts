import { Server } from "socket.io";
import { CustomSocket } from "../../interface";
import { authenticationMiddleware } from "./middleware/socket.auth.middleware";
import { createChat } from "./events/create-chat.events";
import { fetchChats } from "./events/fetch-chat-events";
import { addParticipants } from "./events/add-participants.events";
// import { removeParticipants } from "./events/remove-participants.events";
import { joinRoom } from "./events/join-room.events";
import { sendMessage } from "./events/send-message.events";
import { fetchChatMessage } from "./events/chat-message.events";
import { leaveRoom } from "./events/leave-room.events";
import { leaveChat } from "./events/leave-chat.events";

export const initializeSocketIO = (io: Server): void => {
  io.use(authenticationMiddleware);

  io.on("connection", (socket: CustomSocket) => {
    try {
      console.log(`Socket connected -> User ID: ${socket.user?.id} ${socket.user?.name}`);

      createChat(socket,io);
      fetchChats(socket);
      addParticipants(socket,io);
      // removeParticipants(socket,io);
      fetchChatMessage(socket,io);
      joinRoom(socket,io);
      leaveRoom(socket,io);
      leaveChat(socket,io);
      sendMessage(socket,io);
      
      socket.on("disconnect", () => console.log(`Socket disconnected -> User ID: ${socket.user?.id}`));

    } catch (error: any) {
      console.error("Socket connection error:", error.message);
      socket.emit(
        "socket-error",
        error?.message || "An error occurred while connecting to the socket."
      );
    }
  });
};