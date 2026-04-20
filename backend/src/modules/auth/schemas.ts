import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  name: z.string().min(1).optional(),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(1, "Password is required"),
});

export const oauthSchema = z.object({
  email: z.string().email("Invalid email"),
  name: z.string().optional(),
  googleId: z.string().optional(),
  imageUrl: z.string().optional(),
});

export const refreshSchema = z.object({
  refreshToken: z.string().min(1, "Refresh token is required"),
});

export type RegisterBody = z.infer<typeof registerSchema>;
export type LoginBody = z.infer<typeof loginSchema>;
export type OAuthBody = z.infer<typeof oauthSchema>;
export type RefreshBody = z.infer<typeof refreshSchema>;
