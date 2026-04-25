import type { RequestHandler } from "express";

/**
 * In Express 5, async route handlers are natively supported —
 * rejected promises are automatically forwarded to error handlers.
 * This wrapper is kept for backwards compatibility but is now a no-op.
 */
export const asyncHandler = (fn: RequestHandler): RequestHandler => fn;
