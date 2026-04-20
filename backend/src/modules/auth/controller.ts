import { Request, Response } from "express";
import { asyncHandler } from "../../shared/utils/asyncHandler.js";
import * as authService from "./service.js";

export const register = asyncHandler(async (req: Request, res: Response) => {
  const result = await authService.register(req.body);
  res.status(201).json(result);
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const result = await authService.login(req.body);
  res.json(result);
});

export const oauthLogin = asyncHandler(async (req: Request, res: Response) => {
  const result = await authService.oauthLogin(req.body);
  res.json(result);
});

export const refresh = asyncHandler(async (req: Request, res: Response) => {
  const result = await authService.refresh(req.body.refreshToken);
  res.json(result);
});

export const getMe = asyncHandler(async (req: Request, res: Response) => {
  const user = await authService.getMe(req.user!.id);
  res.json({ user });
});
