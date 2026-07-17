import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { financeService } from "@/lib/services/finance-service";
import { Budget } from "@/types/finance";
import { useAuthReady } from "@/lib/hooks/useAuthReady";

export function useBudgets() {
  const queryClient = useQueryClient();
  const authReady = useAuthReady();

  const budgets = useQuery({
    queryKey: ["finance", "budgets"],
    queryFn: financeService.getBudgets,
    enabled: authReady,
  });

  const createBudget = useMutation({
    mutationFn: (data: Partial<Budget>) => financeService.createBudget(data),
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["finance", "budgets"] }),
  });

  const updateBudget = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Budget> }) =>
      financeService.updateBudget(id, data),
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: ["finance", "budgets"] }),
  });

  const deleteBudget = useMutation({
    mutationFn: (id: string) => financeService.deleteBudget(id),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["finance", "budgets"] });
      queryClient.invalidateQueries({ queryKey: ["finance", "transactions"] });
    },
  });

  const bulkDeleteBudgets = useMutation({
    mutationFn: (ids: string[]) => financeService.bulkDeleteBudgets(ids),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["finance", "budgets"] });
      queryClient.invalidateQueries({ queryKey: ["finance", "transactions"] });
    },
  });

  return {
    budgets,
    createBudget,
    updateBudget,
    deleteBudget,
    bulkDeleteBudgets,
  };
}
