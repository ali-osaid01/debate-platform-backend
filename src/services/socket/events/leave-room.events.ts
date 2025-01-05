import { Server } from "socket.io"
import { CustomSocket } from "../../../interface"
import { SOCKET_EVENTS } from "../../../interface/enum"

export const leaveRoom = async (socket: CustomSocket, io: Server) => {
    socket.on(SOCKET_EVENTS["USER-LEAVE-ROOM"], async (chat) => {
    socket.leave(chat)
    console.log("User leave the room",chat)
    io.to(chat).emit(SOCKET_EVENTS["USER-LEAVE-ROOM"], { message: 'User Leave the room' })
  })
}
