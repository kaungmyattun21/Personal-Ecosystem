import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { financeService } from "@/lib/services/finance-service";
import { Transaction, Bill, Account, TransactionFilterParams } from "@/types/finance";
import { financeKeys, financeQueries } from "../../shared/financeQueries";

export function useTransactions(filters?: TransactionFilterParams) {
  const queryClient = useQueryClient();

  const transactions = useQuery(financeQueries.transactions(filters));

  const createTransaction = useMutation({
    mutationFn: (data: Partial<Transaction>) =>
      financeService.createTransaction(data),
    onMutate: async (newTx) => {
      await Promise.all([
        queryClient.cancelQueries({ queryKey: financeKeys.transactions.all() }),
        queryClient.cancelQueries({ queryKey: financeKeys.bills() }),
        queryClient.cancelQueries({ queryKey: financeKeys.accounts() }),
      ]);

      const previousTx = queryClient.getQueryData<Transaction[]>(financeKeys.transactions.all());
      const previousBills = queryClient.getQueryData<Bill[]>(financeKeys.bills());
      const previousAccounts = queryClient.getQueryData<Account[]>(financeKeys.accounts());

      // Optimistically update transactions
      if (previousTx) {
        queryClient.setQueryData<Transaction[]>(
          financeKeys.transactions.all(),
          [
            {
              ...newTx,
              id: "temp-" + Date.now(),
              date: newTx.date || new Date().toISOString(),
            } as Transaction,
            ...previousTx,
          ],
        );
      }

      // Optimistically update bills if billId present
      if (previousBills && newTx.billId) {
        queryClient.setQueryData<Bill[]>(
          financeKeys.bills(),
          previousBills.map((b) =>
            b.id === newTx.billId ? { ...b, status: "PAID" } : b,
          ),
        );
      }

      // Optimistically update account balance
      if (previousAccounts && newTx.accountId && newTx.amount) {
        queryClient.setQueryData<Account[]>(
          financeKeys.accounts(),
          previousAccounts.map((acc) => {
            if (acc.id === newTx.accountId) {
              const change =
                newTx.type === "INCOME"
                   ? Number(newTx.amount)
                   : -Number(newTx.amount);
              return {
                ...acc,
                balance: (Number(acc.balance) + change).toString(),
              };
            }
            return acc;
          }),
        );
      }

      return { previousTx, previousBills, previousAccounts };
    },
    onError: (err, newTx, context) => {
      if (context?.previousTx)
        queryClient.setQueryData(
          financeKeys.transactions.all(),
          context.previousTx,
        );
      if (context?.previousBills)
        queryClient.setQueryData(financeKeys.bills(), context.previousBills);
      if (context?.previousAccounts)
        queryClient.setQueryData(
          financeKeys.accounts(),
          context.previousAccounts,
        );
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
      const previous = queryClient.getQueryData<Transaction[]>(financeKeys.transactions.all());
      if (previous) {
        queryClient.setQueryData<Transaction[]>(
          financeKeys.transactions.all(),
          previous.map((tx) => (tx.id === id ? { ...tx, ...data } : tx)),
        );
      }
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous)
        queryClient.setQueryData(financeKeys.transactions.all(), context.previous);
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
        queryClient.cancelQueries({ queryKey: financeKeys.accounts() }),
      ]);

      const previousTx = queryClient.getQueryData<Transaction[]>(financeKeys.transactions.all());
      const previousBills = queryClient.getQueryData<Bill[]>(financeKeys.bills());
      const previousAccounts = queryClient.getQueryData<Account[]>(financeKeys.accounts());

      const txToDelete = previousTx?.find((t) => t.id === id);

      // Optimistically remove transaction
      if (previousTx) {
        queryClient.setQueryData<Transaction[]>(
          financeKeys.transactions.all(),
          previousTx.filter((t) => t.id !== id),
        );
      }

      // Optimistically un-pay bill if it was linked
      if (previousBills && txToDelete?.billId) {
        queryClient.setQueryData<Bill[]>(
          financeKeys.bills(),
          previousBills.map((b) =>
            b.id === txToDelete.billId ? { ...b, status: "UNPAID" } : b,
          ),
        );
      }

      // Optimistically restore account balance
      if (previousAccounts && txToDelete) {
        queryClient.setQueryData<Account[]>(
          financeKeys.accounts(),
          previousAccounts.map((acc) => {
            if (acc.id === txToDelete.accountId) {
              const change =
                txToDelete.type === "INCOME"
                   ? -Number(txToDelete.amount)
                   : Number(txToDelete.amount);
              return {
                ...acc,
                balance: (Number(acc.balance) + change).toString(),
              };
            }
            return acc;
          }),
        );
      }

      return { previousTx, previousBills, previousAccounts };
    },
    onError: (_err, _id, context) => {
      if (context?.previousTx)
        queryClient.setQueryData(
          financeKeys.transactions.all(),
          context.previousTx,
        );
      if (context?.previousBills)
        queryClient.setQueryData(financeKeys.bills(), context.previousBills);
      if (context?.previousAccounts)
        queryClient.setQueryData(
          financeKeys.accounts(),
          context.previousAccounts,
        );
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
