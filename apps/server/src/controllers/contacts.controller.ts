import type { Request, Response } from "express";
import { contactsService } from "../services/contacts.service.js";

export const contactsController = {
  async list(req: Request, res: Response) {
    const data = await contactsService.list(req.auth!.userId);
    res.json({ success: true, data });
  },

  async create(req: Request, res: Response) {
    const data = await contactsService.create(req.auth!.userId, req.body);
    res.status(201).json({ success: true, data });
  },

  async update(req: Request, res: Response) {
    const data = await contactsService.update(req.auth!.userId, req.params.id, req.body);
    res.json({ success: true, data });
  },

  async remove(req: Request, res: Response) {
    await contactsService.remove(req.auth!.userId, req.params.id);
    res.json({ success: true, data: { deleted: true } });
  },

  async sendVerification(req: Request, res: Response) {
    const data = await contactsService.sendVerification(req.auth!.userId, req.params.id);
    res.json({ success: true, data });
  },
};
