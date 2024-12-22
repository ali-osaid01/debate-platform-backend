import { Server } from "socket.io"
import { CustomSocket } from "../../../interface"
import { SOCKET_EVENTS } from "../../../interface/enum"

export const joinRoom = async (socket: CustomSocket, io: Server) => {
    socket.on(SOCKET_EVENTS["USER-JOIN-ROOM"], async (payload: { chat: string }) => {
    socket.join(payload.chat)
    io.to(payload.chat).emit(SOCKET_EVENTS["USER-JOIN-ROOM"], { message: 'User joined the room' })
  })
}
