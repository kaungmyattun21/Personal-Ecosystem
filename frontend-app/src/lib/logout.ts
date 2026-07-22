import { signOut } from "next-auth/react";
import { authService } from "@/lib/services/auth-service";

export async function logout() {
  try {
    await authService.logout();
  } catch {
    // noop
  }
  await signOut({ callbackUrl: "/login" });
}
