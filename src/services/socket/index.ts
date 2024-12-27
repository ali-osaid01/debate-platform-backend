import { Server } from "socket.io";
import { CustomSocket } from "../../interface";
import { authenticationMiddleware } from "./middleware/socket.auth.middleware";
import { createChat } from "./events/create-chat.events";
import { fetchChats } from "./events/fetch-chat-events";
import { addParticipants } from "./events/add-participants.events";
import { removeParticipants } from "./events/remove-participants.events";
import { joinRoom } from "./events/join-room.events";
import { sendMessage } from "./events/send-message.events";
import { fetchChatMessage } from "./events/chat-message.events";

// interface ISocketEventParams {
//   req: Request;
//   roomId: string;
//   event: string;
//   payload: any;
// }

export const initializeSocketIO = (io: Server): void => {
  io.use(authenticationMiddleware);

  // Handle socket connections
  io.on("connection", (socket: CustomSocket) => {
    try {
      console.log(`Socket connected -> User ID: ${socket.user?.id} ${socket.user?.name}`);

      createChat(socket,io);
      fetchChats(socket);
      addParticipants(socket,io);
      removeParticipants(socket,io);
      sendMessage(socket,io);
      fetchChatMessage(socket,io);
      joinRoom(socket,io);
      fetchChatMessage(socket,io);
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

// // Utility function to emit events to a specific room
// export const emitSocketEvent = ({
//   req,
//   roomId,
//   event,
//   payload,
// }: ISocketEventParams): void => {
//   const io = req.app.get("io") as Server;
//   io.to(roomId).emit(event, payload);
// };
