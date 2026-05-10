import type { ZodTypeAny } from "zod";
import type { Request, Response, NextFunction } from "express";

export function validateBody(schema: ZodTypeAny) {
  return (req: Request, _res: Response, next: NextFunction) => {
    req.body = schema.parse(req.body);
    next();
  };
}

export function validateParams(schema: ZodTypeAny) {
  return (req: Request, _res: Response, next: NextFunction) => {
    req.params = schema.parse(req.params) as Request["params"];
    next();
  };
}
