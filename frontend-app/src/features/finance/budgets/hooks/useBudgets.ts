import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { financeService } from "@/lib/services/finance-service";
import { Budget } from "@/types/finance";
import { useAuthReady } from "@/lib/hooks/useAuthReady";
import { financeKeys, financeQueries } from "../../shared/financeQueries";

export function useBudgets() {
  const queryClient = useQueryClient();
  const authReady = useAuthReady();

  const budgets = useQuery({ ...financeQueries.budgets(), enabled: authReady });

  const invalidateAll = () =>
    queryClient.invalidateQueries({ queryKey: financeKeys.all });

  const createBudget = useMutation({
    mutationFn: (data: Partial<Budget>) => financeService.createBudget(data),
    onSettled: invalidateAll,
  });

  const updateBudget = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Budget> }) =>
      financeService.updateBudget(id, data),
    onSettled: invalidateAll,
  });

  const deleteBudget = useMutation({
    mutationFn: (id: string) => financeService.deleteBudget(id),
    onSettled: invalidateAll,
  });

  const bulkDeleteBudgets = useMutation({
    mutationFn: (ids: string[]) => financeService.bulkDeleteBudgets(ids),
    onSettled: invalidateAll,
  });

  return {
    budgets,
    createBudget,
    updateBudget,
    deleteBudget,
    bulkDeleteBudgets,
  };
}
