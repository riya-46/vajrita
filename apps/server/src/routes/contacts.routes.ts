import { Router } from "express";
import { z } from "zod";
import { contactCreateSchema, contactUpdateSchema } from "@vajrita/shared";
import { contactsController } from "../controllers/contacts.controller.js";
import { requireAuth } from "../middleware/auth.js";
import { validateBody, validateParams } from "../middleware/validate.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const idParam = z.object({ id: z.string().min(1) });

export const contactsRouter = Router();

contactsRouter.use(requireAuth);
contactsRouter.get("/", asyncHandler(contactsController.list));
contactsRouter.post("/", validateBody(contactCreateSchema), asyncHandler(contactsController.create));
contactsRouter.patch("/:id", validateParams(idParam), validateBody(contactUpdateSchema), asyncHandler(contactsController.update));
contactsRouter.delete("/:id", validateParams(idParam), asyncHandler(contactsController.remove));
contactsRouter.post("/:id/send-verification", validateParams(idParam), asyncHandler(contactsController.sendVerification));
