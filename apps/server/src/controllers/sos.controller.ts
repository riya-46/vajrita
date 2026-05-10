import type { Request, Response } from "express";
import { sosService } from "../services/sos.service.js";
import { getSingleParam } from "../utils/request.js";

export const sosController = {
  async start(req: Request, res: Response) {
    const data = await sosService.start(req.auth!.userId, req.body);
    res.status(201).json({ success: true, data });
  },

  async active(req: Request, res: Response) {
    const data = await sosService.active(req.auth!.userId);
    res.json({ success: true, data });
  },

  async retry(req: Request, res: Response) {
    const data = await sosService.retry(req.auth!.userId, getSingleParam(req.params.id), req.body.attemptIds);
    res.json({ success: true, data });
  },

  async end(req: Request, res: Response) {
    const data = await sosService.end(req.auth!.userId, getSingleParam(req.params.id));
    res.json({ success: true, data });
  },
};
