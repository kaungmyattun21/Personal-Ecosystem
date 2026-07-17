import { useQuery } from "@tanstack/react-query";
import { financeQueries } from "../financeQueries";
import { useAuthReady } from "@/lib/hooks/useAuthReady";

export function useAccounts() {
  const authReady = useAuthReady();
  const accounts = useQuery({ ...financeQueries.accounts(), enabled: authReady });

  return { accounts };
}
