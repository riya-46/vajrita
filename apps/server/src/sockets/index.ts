import type { Server as HttpServer } from "node:http";
import { Server } from "socket.io";
import { env } from "../config/env.js";
import { verifyAccessToken } from "../utils/jwt.js";

let io: Server | null = null;

export function initializeSockets(server: HttpServer) {
  io = new Server(server, {
    cors: {
      origin: [env.CLIENT_URL, env.MOBILE_APP_URL],
      credentials: true,
    },
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth?.token as string | undefined;
    if (!token) {
      return next();
    }

    try {
      const payload = verifyAccessToken(token);
      socket.data.userId = payload.sub;
      next();
    } catch (error) {
      next(error as Error);
    }
  });

  io.on("connection", (socket) => {
    if (socket.data.userId) {
      socket.join(`user:${socket.data.userId}`);
    }

    socket.on("watch:track", (shareToken: string) => {
      if (shareToken) {
        socket.join(`track:${shareToken}`);
      }
    });

    socket.on("watch:leave", (shareToken: string) => {
      if (shareToken) {
        socket.leave(`track:${shareToken}`);
      }
    });
  });

  return io;
}

export function emitToUser(userId: string, event: string, payload: unknown) {
  io?.to(`user:${userId}`).emit(event, payload);
}

export function emitToTrack(shareToken: string, event: string, payload: unknown) {
  io?.to(`track:${shareToken}`).emit(event, payload);
}
