import { Server } from "socket.io";
import { CustomSocket } from "../../../interface";
import { SOCKET_EVENTS } from "../../../interface/enum";
import { messageRepository } from "../..";

export const sendMessage = async (socket: CustomSocket, io: Server) => {
    socket.on(SOCKET_EVENTS.SEND_MESSAGE, async (payload: { chat: string, message: string, type?: "text" | "image" | "video" | "audio" | "document",media:string }) => {
        
        const message = await messageRepository.create({ 
            chat: payload.chat, 
            content: payload.message, 
            sender: socket.user?.id, 
            messageType: payload.type || "text", 
            media: payload.media 
        });
        console.log("MESSAGE ->", message);
        io.to(payload.chat).emit(SOCKET_EVENTS.NEW_MESSAGE, { message: message });
    });
}
