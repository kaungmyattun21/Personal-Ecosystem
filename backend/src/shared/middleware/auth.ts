import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../../config/env.js";

export interface JwtPayload {
  userId: string;
  email: string;
  iat?: number;
  exp?: number;
}

export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    res.status(401).json({ code: "UNAUTHORIZED", message: "Missing or invalid Authorization header" });
    return;
  }

  const token = authHeader.slice(7);
  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
    req.user = { id: decoded.userId, email: decoded.email, name: null };
    next();
  } catch {
    res.status(401).json({ code: "UNAUTHORIZED", message: "Invalid or expired token" });
  }
}
