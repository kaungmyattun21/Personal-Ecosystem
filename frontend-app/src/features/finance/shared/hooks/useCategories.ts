import { useQuery } from "@tanstack/react-query";
import { financeQueries } from "../financeQueries";
import { useAuthReady } from "./useAuthReady";

export function useCategories() {
  const authReady = useAuthReady();
  const categories = useQuery({ ...financeQueries.categories(), enabled: authReady });

  return { categories };
}
