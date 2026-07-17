import { useSyncExternalStore } from "react";
import { useSession } from "next-auth/react";
import { getAuthToken, subscribeAuthToken } from "@/lib/api-client";


export function useAuthReady(): boolean {
  const { status } = useSession();
  const hasToken = useSyncExternalStore(
    subscribeAuthToken,
    () => getAuthToken() !== null,
    () => false, // server snapshot: no token on the server
  );

  return status === "authenticated" && hasToken;
}