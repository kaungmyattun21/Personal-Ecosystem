"use client";

import { SessionProvider as NextAuthSessionProvider } from "next-auth/react";
import { AuthTokenSync } from "./auth-token-sync";

// Re-fetch session 5 minutes before access token expires so the JWT callback
// runs server-side, refreshes the token, and pushes the new one to the client.
const REFETCH_INTERVAL_SECONDS = 4 * 60; // 4 min

export function SessionProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextAuthSessionProvider refetchInterval={REFETCH_INTERVAL_SECONDS} refetchOnWindowFocus={false}>
      <AuthTokenSync />
      {children}
    </NextAuthSessionProvider>
  );
}
