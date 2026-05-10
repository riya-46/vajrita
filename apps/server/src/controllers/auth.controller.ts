import type { Request, Response } from "express";
import { authService } from "../services/auth.service.js";

export const authController = {
  async exchange(req: Request, res: Response) {
    const data = await authService.exchangeFirebaseToken(
      req.body.firebaseToken,
      req.body.name,
      req.headers["user-agent"],
    );
    res.json({ success: true, data });
  },

  async refresh(req: Request, res: Response) {
    const data = await authService.refresh(req.body.refreshToken, req.headers["user-agent"]);
    res.json({ success: true, data });
  },

  async logout(req: Request, res: Response) {
    await authService.logout(req.body.refreshToken);
    res.json({ success: true, data: { loggedOut: true } });
  },

  async me(req: Request, res: Response) {
    const data = await authService.me(req.auth!.userId);
    res.json({ success: true, data });
  },
};
