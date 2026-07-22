import { apiFetch } from "../api-client";

export const authService = {
  logout: () => apiFetch("/auth/logout", { method: "POST" }),
};
