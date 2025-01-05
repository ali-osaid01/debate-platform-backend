import { Server } from "socket.io"
import { CustomSocket } from "../../../interface"
import { SOCKET_EVENTS } from "../../../interface/enum"
import { IUser } from "../../../interface/user.interface"
import { chatRepository } from "../.."

export const addParticipants = async (socket: CustomSocket, io: Server) => {
  socket.on(SOCKET_EVENTS.CHAT_CREATED, async (payload: { user: IUser, chat: string }) => {
    console.log("user", payload.user)
    
    // socket.join(payload.chat)

    const addParticipants = await chatRepository.updateById(
      payload.chat,
      { $addToSet: { participants: payload.user.id } }
    );
    io.to(payload.chat).emit(SOCKET_EVENTS.CHAT_CREATED,addParticipants)
  })
}
