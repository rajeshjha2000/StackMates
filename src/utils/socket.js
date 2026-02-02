import io from "socket.io-client";
import { BASE_URL } from "./constants";

export const createSocketConnection = () => {
  // Use BASE_URL from environment for socket connection
  return io(BASE_URL);
};
