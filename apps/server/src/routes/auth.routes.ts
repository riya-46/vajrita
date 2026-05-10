import { Router } from "express";
import { authExchangeSchema, refreshTokenSchema } from "@vajrita/shared";
import { authController } from "../controllers/auth.controller.js";
import { requireAuth } from "../middleware/auth.js";
import { authRateLimit } from "../middleware/rateLimits.js";
import { validateBody } from "../middleware/validate.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const authRouter = Router();

authRouter.post("/exchange", authRateLimit, validateBody(authExchangeSchema), asyncHandler(authController.exchange));
authRouter.post("/refresh", authRateLimit, validateBody(refreshTokenSchema), asyncHandler(authController.refresh));
authRouter.post("/logout", validateBody(refreshTokenSchema), asyncHandler(authController.logout));
authRouter.get("/me", requireAuth, asyncHandler(authController.me));
