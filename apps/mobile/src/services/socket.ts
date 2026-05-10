import { io, type Socket } from "socket.io-client";
import Constants from "expo-constants";
import { useAuthStore } from "../store/auth.store";

let socket: Socket | null = null;

export function getSocket() {
  if (!socket) {
    const url = (
      process.env.EXPO_PUBLIC_API_URL ||
      Constants.expoConfig?.extra?.apiUrl ||
      "http://localhost:4000"
    ).replace(/\/$/, "");
    socket = io(url, {
      transports: ["websocket"],
      auth: {
        token: useAuthStore.getState().accessToken,
      },
    });
  }

  return socket;
}
