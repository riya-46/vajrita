import type { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/AppError.js";
import { verifyAccessToken } from "../utils/jwt.js";

export function requireAuth(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    return next(new AppError("Authentication required", 401, "UNAUTHORIZED"));
  }

  try {
    const payload = verifyAccessToken(token);
    req.auth = { userId: payload.sub, phone: payload.phone };
    return next();
  } catch (error) {
    return next(new AppError("Invalid or expired access token", 401, "TOKEN_INVALID", error));
  }
}
