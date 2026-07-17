import { useQuery, useMutation, useQueryClient, QueryKey } from "@tanstack/react-query";
import { financeService } from "@/lib/services/finance-service";
import { Transaction, Bill, TransactionFilterParams } from "@/types/finance";
import { financeKeys, financeQueries } from "../../shared/financeQueries";
import { useAuthReady } from "@/lib/hooks/useAuthReady";


type TransactionSnapshot = [QueryKey, Transaction[] | undefined][];

export function useTransactions(filters?: TransactionFilterParams) {
  const queryClient = useQueryClient();
  const authReady = useAuthReady();

  const transactions = useQuery({
    ...financeQueries.transactions(filters),
    enabled: authReady,
  });

  const snapshotTransactions = (): TransactionSnapshot =>
    queryClient.getQueriesData<Transaction[]>({
      queryKey: financeKeys.transactions.all(),
    });

  const restoreTransactions = (snapshot?: TransactionSnapshot) => {
    snapshot?.forEach(([key, data]) => {
      queryClient.setQueryData(key, data);
    });
  };

  const createTransaction = useMutation({
    mutationFn: (data: Partial<Transaction>) =>
      financeService.createTransaction(data),
    onMutate: async (newTx) => {
      await Promise.all([
        queryClient.cancelQueries({ queryKey: financeKeys.transactions.all() }),
        queryClient.cancelQueries({ queryKey: financeKeys.bills() }),
      ]);

      const previousTx = snapshotTransactions();
      const previousBills = queryClient.getQueryData<Bill[]>(financeKeys.bills());

      const optimisticTx = {
        ...newTx,
        id: "temp-" + Date.now(),
        date: newTx.date || new Date().toISOString(),
      } as Transaction;

      queryClient.setQueriesData<Transaction[]>(
        { queryKey: financeKeys.transactions.all() },
        (old) => (old ? [optimisticTx, ...old] : old),
      );

      // Optimistically update bills if billId present
      if (previousBills && newTx.billId) {
        queryClient.setQueryData<Bill[]>(
          financeKeys.bills(),
          previousBills.map((b) =>
            b.id === newTx.billId ? { ...b, status: "PAID" } : b,
          ),
        );
      }

      return { previousTx, previousBills };
    },
    onError: (err, newTx, context) => {
      restoreTransactions(context?.previousTx);
      if (context?.previousBills)
        queryClient.setQueryData(financeKeys.bills(), context.previousBills);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: financeKeys.all });
    },
  });

  const updateTransaction = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Transaction> }) =>
      financeService.updateTransaction(id, data),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({
        queryKey: financeKeys.transactions.all(),
      });

      const previous = snapshotTransactions();

      queryClient.setQueriesData<Transaction[]>(
        { queryKey: financeKeys.transactions.all() },
        (old) => old?.map((tx) => (tx.id === id ? { ...tx, ...data } : tx)),
      );

      return { previous };
    },
    onError: (_err, _vars, context) => {
      restoreTransactions(context?.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: financeKeys.all });
    },
  });

  const deleteTransaction = useMutation({
    mutationFn: (id: string) => financeService.deleteTransaction(id),
    onMutate: async (id) => {
      await Promise.all([
        queryClient.cancelQueries({ queryKey: financeKeys.transactions.all() }),
        queryClient.cancelQueries({ queryKey: financeKeys.bills() }),
      ]);

      const previousTx = snapshotTransactions();
      const previousBills = queryClient.getQueryData<Bill[]>(financeKeys.bills());

      const txToDelete = previousTx
        .flatMap(([, list]) => list ?? [])
        .find((t) => t.id === id);

      queryClient.setQueriesData<Transaction[]>(
        { queryKey: financeKeys.transactions.all() },
        (old) => old?.filter((t) => t.id !== id),
      );

      // Optimistically un-pay bill if it was linked
      if (previousBills && txToDelete?.billId) {
        queryClient.setQueryData<Bill[]>(
          financeKeys.bills(),
          previousBills.map((b) =>
            b.id === txToDelete.billId ? { ...b, status: "UNPAID" } : b,
          ),
        );
      }

      return { previousTx, previousBills };
    },
    onError: (_err, _id, context) => {
      restoreTransactions(context?.previousTx);
      if (context?.previousBills)
        queryClient.setQueryData(financeKeys.bills(), context.previousBills);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: financeKeys.all });
    },
  });

  const bulkDeleteTransactions = useMutation({
    mutationFn: (ids: string[]) => financeService.bulkDeleteTransactions(ids),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: financeKeys.all });
    },
  });

  return {
    transactions,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    bulkDeleteTransactions,
  };
}
