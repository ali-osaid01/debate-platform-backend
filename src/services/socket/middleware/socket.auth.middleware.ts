import { CustomSocket } from "../../../interface";
import { IUser } from "../../../interface/user.interface";
import jwt from "jsonwebtoken";

export const authenticationMiddleware = (
  socket: CustomSocket,
  next: (err?: Error) => void
): void => {
  try {
    const token = socket.handshake.headers?.["accesstoken"] as string;

    if (!token) {
      console.error("Access token is missing in the socket connection.");
      return next(new Error("Authentication failed: Missing token."));
    }

    const jwtSecret = process.env.ACCESS_TOKEN_SECRET;
    if (!jwtSecret) {
      console.error("JWT secret is not defined in environment variables.");
      return next(new Error("Server configuration error."));
    }

    // Verify JWT token
    const decodedToken = jwt.verify(token, jwtSecret) as Partial<IUser>;

    if (!decodedToken.id) {
      console.error("Invalid token: Missing user ID.");
      return next(new Error("Authentication failed: Invalid token."));
    }

    // Attach the user to the socket
    socket.user = decodedToken;

    // Join the user to their private room
    socket.join(socket.user.id as string);

    console.log(`Socket authenticated -> User ID: ${socket.user.id}`);
    next();
  } catch (error: any) {
    console.error("Authentication error:", error.message);
    next(new Error("Authentication failed: Invalid token."));
  }
};