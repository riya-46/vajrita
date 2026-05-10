import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { env } from "./config/env.js";
import { authController } from "./controllers/auth.controller.js";
import { requireAuth } from "./middleware/auth.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { notFoundHandler } from "./middleware/notFound.js";
import { authRouter } from "./routes/auth.routes.js";
import { contactsRouter } from "./routes/contacts.routes.js";
import { fakeCallRouter } from "./routes/fakeCall.routes.js";
import { publicRouter } from "./routes/public.routes.js";
import { sosRouter } from "./routes/sos.routes.js";
import { trackingRouter } from "./routes/tracking.routes.js";
import { asyncHandler } from "./utils/asyncHandler.js";

export function createApp() {
  const app = express();

  app.use(
    cors({
      origin: [env.CLIENT_URL, env.MOBILE_APP_URL],
      credentials: true,
    }),
  );
  app.use(helmet({ crossOriginResourcePolicy: false }));
  app.use(compression());
  app.use(cookieParser());
  app.use(express.json({ limit: "1mb" }));
  app.use(morgan(env.NODE_ENV === "production" ? "combined" : "dev"));

  app.get("/health", (_req, res) => {
    res.json({ success: true, data: { status: "ok" } });
  });

  app.use("/api/auth", authRouter);
  app.get("/api/me", requireAuth, asyncHandler(authController.me));
  app.use("/api/contacts", contactsRouter);
  app.use("/api/sos", sosRouter);
  app.use("/api/tracking", trackingRouter);
  app.use("/api/fake-call", fakeCallRouter);
  app.use("/public", publicRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
