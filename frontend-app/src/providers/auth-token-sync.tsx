"use client";

import { useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { setAuthToken } from "@/lib/api-client";

export function AuthTokenSync() {
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.error === "RefreshAccessTokenError") {
      signOut({ callbackUrl: "/" });
      return;
    }
    setAuthToken(session?.accessToken ?? null);
  }, [session]);

  return null;
}
