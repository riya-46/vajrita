import { Router } from "express";
import { z } from "zod";
import { emergencyRetrySchema, emergencyStartSchema } from "@vajrita/shared";
import { sosController } from "../controllers/sos.controller.js";
import { requireAuth } from "../middleware/auth.js";
import { emergencyRateLimit } from "../middleware/rateLimits.js";
import { validateBody, validateParams } from "../middleware/validate.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const idParam = z.object({ id: z.string().min(1) });

export const sosRouter = Router();

sosRouter.use(requireAuth);
sosRouter.post("/start", emergencyRateLimit, validateBody(emergencyStartSchema), asyncHandler(sosController.start));
sosRouter.get("/active", asyncHandler(sosController.active));
sosRouter.post("/:id/retry", validateParams(idParam), validateBody(emergencyRetrySchema), asyncHandler(sosController.retry));
sosRouter.post("/:id/end", validateParams(idParam), asyncHandler(sosController.end));
