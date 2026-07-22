import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { financeService } from "@/lib/services/finance-service";
import { Bill } from "@/types/finance";
import { useAuthReady } from "@/lib/hooks/useAuthReady";
import { financeKeys, financeQueries } from "../../shared/financeQueries";

export function useBills() {
  const queryClient = useQueryClient();
  const authReady = useAuthReady();

  const bills = useQuery({ ...financeQueries.bills(), enabled: authReady });

  const invalidateAll = () =>
    queryClient.invalidateQueries({ queryKey: financeKeys.all });

  const createBill = useMutation({
    mutationFn: (data: Partial<Bill>) => financeService.createBill(data),
    onSettled: invalidateAll,
  });

  const updateBill = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Bill> }) =>
      financeService.updateBill(id, data),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: financeKeys.bills() });
      const previous = queryClient.getQueryData<Bill[]>(financeKeys.bills());
      if (previous) {
        queryClient.setQueryData<Bill[]>(
          financeKeys.bills(),
          previous.map(b => b.id === id ? { ...b, ...data } : b)
        );
      }
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) queryClient.setQueryData(financeKeys.bills(), context.previous);
    },
    onSettled: invalidateAll,
  });

  const deleteBill = useMutation({
    mutationFn: (id: string) => financeService.deleteBill(id),
    onSettled: invalidateAll,
  });

  return {
    bills,
    createBill,
    updateBill,
    deleteBill,
  };
}
