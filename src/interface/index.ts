import { Socket } from "socket.io";
import { IUser } from "./user.interface";

export interface ApiResponse {
    code: number;
    status: boolean;
    msg: string;
    data?: string | object;
    total?: number;
}

export interface CustomSocket extends Socket {
    user?: Partial<IUser>;
  }