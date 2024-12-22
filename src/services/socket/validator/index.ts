import { CustomSocket } from "../../../interface";

export const handleValidation = async <T>(socket: CustomSocket, payload: T, validator: any) => {
    try {
      await validator.validate(payload);
      return true
    } catch (error: any) {
      socket.emit('chat-socket-error', error.errors || 'Validation failed');
      return false;  
    }
  };