import { Router } from "express";
import { z } from "zod";
import { trackingPingSchema, trackingStartSchema } from "@vajrita/shared";
import { trackingController } from "../controllers/tracking.controller.js";
import { requireAuth } from "../middleware/auth.js";
import { validateBody, validateParams } from "../middleware/validate.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const idParam = z.object({ id: z.string().min(1) });

export const trackingRouter = Router();

trackingRouter.use(requireAuth);
trackingRouter.get("/active", asyncHandler(trackingController.active));
trackingRouter.post("/start", validateBody(trackingStartSchema), asyncHandler(trackingController.start));
trackingRouter.post("/:id/ping", validateParams(idParam), validateBody(trackingPingSchema), asyncHandler(trackingController.ping));
trackingRouter.post("/:id/stop", validateParams(idParam), asyncHandler(trackingController.stop));
trackingRouter.get("/:id", validateParams(idParam), asyncHandler(trackingController.get));
