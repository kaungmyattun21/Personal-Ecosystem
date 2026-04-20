import type { Request, Response, NextFunction } from "express";
import { env } from "../../config/env.js";
import { AppError } from "../utils/AppError.js";

export function errorHandler(
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  const isDev = env.NODE_ENV === "development";

  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal server error";
  let code = err.code || "INTERNAL_ERROR";

  if (!isDev && !err.isOperational) {
    statusCode = 500;
    message = "Something went very wrong!";
    code = "INTERNAL_ERROR";
  }

  res.status(statusCode).json({
    status: err.status || "error",
    code,
    message,
    ...(isDev && { stack: err.stack }),
  });
}
