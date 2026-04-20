import { useQuery } from "@tanstack/react-query";
import { financeQueries } from "../financeQueries";

export function useAccounts() {
  const accounts = useQuery(financeQueries.accounts());

  return { accounts };
}
