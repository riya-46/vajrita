import type { Request, Response } from "express";
import { trackingService } from "../services/tracking.service.js";

export const trackingController = {
  async active(req: Request, res: Response) {
    const data = await trackingService.getActive(req.auth!.userId);
    res.json({ success: true, data });
  },

  async start(req: Request, res: Response) {
    const data = await trackingService.createSession(req.auth!.userId, req.body);
    res.status(201).json({ success: true, data });
  },

  async ping(req: Request, res: Response) {
    const data = await trackingService.ping(req.auth!.userId, req.params.id, req.body.location);
    res.json({ success: true, data });
  },

  async stop(req: Request, res: Response) {
    const data = await trackingService.stop(req.auth!.userId, req.params.id);
    res.json({ success: true, data });
  },

  async get(req: Request, res: Response) {
    const data = await trackingService.getOwned(req.auth!.userId, req.params.id);
    res.json({ success: true, data });
  },
};
