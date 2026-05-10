import type { Request, Response } from "express";
import { fakeCallService } from "../services/fakeCall.service.js";

export const fakeCallController = {
  async get(req: Request, res: Response) {
    const data = await fakeCallService.get(req.auth!.userId);
    res.json({ success: true, data });
  },

  async update(req: Request, res: Response) {
    const data = await fakeCallService.update(req.auth!.userId, req.body);
    res.json({ success: true, data });
  },
};
