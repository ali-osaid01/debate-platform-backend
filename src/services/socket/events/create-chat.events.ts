import { Server } from "socket.io";
import { CustomSocket } from "../../../interface";
import { IChat } from "../../../interface/chat.interface";
import { createChatValidator } from "../../../validator/chat.validate";
import { SOCKET_EVENTS } from "../../../interface/enum";
import { handleValidation } from "../validator";
import { chatRepository } from "../..";

export const createChat = async (socket: CustomSocket,io:Server) => {
  socket.on(SOCKET_EVENTS.CHAT_CREATED, async (payload: IChat) => {
    const isValid = await handleValidation<IChat>(socket, payload, createChatValidator);
    if (!isValid) return; 

    const chat = await chatRepository.create(payload);
    console.log("Chat created", chat);
    socket.emit(`${SOCKET_EVENTS.CHAT_CREATED}-${socket.user?.id}`, chat); 
  });
};
