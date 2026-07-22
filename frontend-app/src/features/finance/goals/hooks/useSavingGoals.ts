import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { financeService } from "@/lib/services/finance-service";
import { SavingGoal } from "@/types/finance";
import { useAuthReady } from "@/lib/hooks/useAuthReady";
import { financeKeys, financeQueries } from "../../shared/financeQueries";

export function useSavingGoals() {
  const queryClient = useQueryClient();
  const authReady = useAuthReady();

  const savingGoals = useQuery({ ...financeQueries.goals(), enabled: authReady });

  const invalidateAll = () =>
    queryClient.invalidateQueries({ queryKey: financeKeys.all });

  const createSavingGoal = useMutation({
    mutationFn: (data: Partial<SavingGoal>) => financeService.createSavingGoal(data),
    onSettled: invalidateAll,
  });

  const updateSavingGoal = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<SavingGoal> }) =>
      financeService.updateSavingGoal(id, data),
    onSettled: invalidateAll,
  });

  const deleteSavingGoal = useMutation({
    mutationFn: (id: string) => financeService.deleteSavingGoal(id),
    onSettled: invalidateAll,
  });

  const createSavingContribution = useMutation({
    mutationFn: (data: any) => financeService.createSavingContribution(data),
    onSettled: invalidateAll,
  });

  return {
    savingGoals,
    createSavingGoal,
    updateSavingGoal,
    deleteSavingGoal,
    createSavingContribution,
  };
}
