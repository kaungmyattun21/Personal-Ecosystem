import { useQuery } from "@tanstack/react-query";
import { financeQueries } from "../financeQueries";

export function useCategories() {
  const categories = useQuery(financeQueries.categories());

  return { categories };
}
