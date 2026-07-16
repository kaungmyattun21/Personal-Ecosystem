import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { financeService } from "@/lib/services/finance-service";
import { Bill } from "@/types/finance";
import { useAuthReady } from "@/features/finance/shared/hooks/useAuthReady";

export function useBills() {
  const queryClient = useQueryClient();
  const authReady = useAuthReady();

  const bills = useQuery({
    queryKey: ["finance", "bills"],
    queryFn: financeService.getBills,
    enabled: authReady,
  });

  const createBill = useMutation({
    mutationFn: (data: Partial<Bill>) => financeService.createBill(data),
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["finance", "bills"] }),
  });

  const updateBill = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Bill> }) =>
      financeService.updateBill(id, data),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: ["finance", "bills"] });
      const previous = queryClient.getQueryData<Bill[]>(["finance", "bills"]);
      if (previous) {
        queryClient.setQueryData<Bill[]>(
          ["finance", "bills"],
          previous.map(b => b.id === id ? { ...b, ...data } : b)
        );
      }
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) queryClient.setQueryData(["finance", "bills"], context.previous);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["finance", "bills"] }),
  });

  const deleteBill = useMutation({
    mutationFn: (id: string) => financeService.deleteBill(id),
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["finance", "bills"] }),
  });

  return {
    bills,
    createBill,
    updateBill,
    deleteBill,
  };
}
