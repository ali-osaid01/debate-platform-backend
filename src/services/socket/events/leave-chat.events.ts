import { Server } from "socket.io"
import { CustomSocket } from "../../../interface"
import { SOCKET_EVENTS } from "../../../interface/enum"
import { chatRepository, messageRepository } from "../../index"

export const leaveChat = async (socket: CustomSocket, io: Server) => {
    socket.on(SOCKET_EVENTS["USER-LEAVE"], async (chat) => {
    console.log("User leave the Chat",chat)
    const message = await messageRepository.create({ chat, content: "Leave the Chat Room", sender: socket.user?.id,isAnnocement:true});
    await chatRepository.updateOne({ _id: chat }, { $pull: { participants: socket.user?.id } });
    io.to(chat).emit(SOCKET_EVENTS.NEW_MESSAGE, {message})
  })
}
