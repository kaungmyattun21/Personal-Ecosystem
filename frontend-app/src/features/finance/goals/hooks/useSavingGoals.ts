import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { financeService } from "@/lib/services/finance-service";
import { SavingGoal } from "@/types/finance";
import { useAuthReady } from "@/lib/hooks/useAuthReady";

export function useSavingGoals() {
  const queryClient = useQueryClient();
  const authReady = useAuthReady();

  const savingGoals = useQuery({
    queryKey: ["finance", "goals"],
    queryFn: financeService.getSavingGoals,
    enabled: authReady,
  });

  const createSavingGoal = useMutation({
    mutationFn: (data: Partial<SavingGoal>) => financeService.createSavingGoal(data),
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["finance", "goals"] }),
  });

  const updateSavingGoal = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<SavingGoal> }) =>
      financeService.updateSavingGoal(id, data),
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["finance", "goals"] }),
  });

  const deleteSavingGoal = useMutation({
    mutationFn: (id: string) => financeService.deleteSavingGoal(id),
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["finance", "goals"] }),
  });

  const createSavingContribution = useMutation({
    mutationFn: (data: any) => financeService.createSavingContribution(data),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["finance", "goals"] });
      queryClient.invalidateQueries({ queryKey: ["finance", "accounts"] });
      queryClient.invalidateQueries({ queryKey: ["finance", "transactions"] });
    },
  });

  return {
    savingGoals,
    createSavingGoal,
    updateSavingGoal,
    deleteSavingGoal,
    createSavingContribution,
  };
}
