import { Router } from "express";
import { fakeCallConfigSchema } from "@vajrita/shared";
import { fakeCallController } from "../controllers/fakeCall.controller.js";
import { requireAuth } from "../middleware/auth.js";
import { validateBody } from "../middleware/validate.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const fakeCallRouter = Router();

fakeCallRouter.use(requireAuth);
fakeCallRouter.get("/config", asyncHandler(fakeCallController.get));
fakeCallRouter.put("/config", validateBody(fakeCallConfigSchema), asyncHandler(fakeCallController.update));
