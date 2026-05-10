import { Router } from "express";
import { z } from "zod";
import { publicController } from "../controllers/public.controller.js";
import { validateParams } from "../middleware/validate.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const tokenParam = z.object({ token: z.string().min(1) });
const shareTokenParam = z.object({ shareToken: z.string().min(1) });

export const publicRouter = Router();

publicRouter.get(
  "/verify-contact/:token",
  validateParams(tokenParam),
  asyncHandler(publicController.verifyContact),
);
publicRouter.get(
  "/track/:shareToken",
  validateParams(shareTokenParam),
  asyncHandler(publicController.publicTrack),
);
