import type { Request, Response, NextFunction } from "express";
import type { ZodSchema, ZodError } from "zod";

export function validateBody<T>(schema: ZodSchema<T>) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);
    if (result.success) {
      req.body = result.data;
      next();
    } else {
      const zodError = result.error as ZodError;
      const errors = zodError.errors.map((e) => ({
        path: e.path.join("."),
        message: e.message,
      }));
      res.status(400).json({ code: "VALIDATION_ERROR", message: "Validation failed", errors });
    }
  };
}
