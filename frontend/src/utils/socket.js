import io from "socket.io-client";
import { BASE_URL } from "./constants";

export const createSocketConnection = () => {
  const isLocalhost =
    location.hostname === "localhost" || location.hostname === "127.0.0.1";
  const socketUrl = import.meta.env.VITE_SOCKET_URL?.trim();
  const socketPath = import.meta.env.VITE_SOCKET_PATH || "/socket.io";

  if (socketUrl) {
    return io(socketUrl, { path: socketPath, withCredentials: true });
  }

  if (isLocalhost) {
    return io(BASE_URL, { withCredentials: true });
  }

  return io(window.location.origin, { path: socketPath, withCredentials: true });
};
