import { queryOptions } from "@tanstack/react-query";
import { financeService } from "@/lib/services/finance-service";
import { TransactionFilterParams } from "@/types/finance";

export const financeKeys = {
  all: ["finance"] as const,
  accounts: () => [...financeKeys.all, "accounts"] as const,
  categories: () => [...financeKeys.all, "categories"] as const,
  bills: () => [...financeKeys.all, "bills"] as const,
  budgets: () => [...financeKeys.all, "budgets"] as const,
  goals: () => [...financeKeys.all, "goals"] as const,
  transactions: {
    all: () => [...financeKeys.all, "transactions"] as const,
    list: (filters?: TransactionFilterParams) =>
      [...financeKeys.transactions.all(), filters || {}] as const,
    detail: (id: string) =>
      [...financeKeys.transactions.all(), "detail", id] as const,
  },
};

export const financeQueries = {
  accounts: () =>
    queryOptions({
      queryKey: financeKeys.accounts(),
      queryFn: financeService.getAccounts,
    }),
  categories: () =>
    queryOptions({
      queryKey: financeKeys.categories(),
      queryFn: financeService.getCategories,
    }),
  bills: () =>
    queryOptions({
      queryKey: financeKeys.bills(),
      queryFn: financeService.getBills,
    }),
  budgets: () =>
    queryOptions({
      queryKey: financeKeys.budgets(),
      queryFn: financeService.getBudgets,
    }),
  goals: () =>
    queryOptions({
      queryKey: financeKeys.goals(),
      queryFn: financeService.getSavingGoals,
    }),
  transactions: (filters?: TransactionFilterParams) =>
    queryOptions({
      queryKey: financeKeys.transactions.list(filters),
      queryFn: () => financeService.getTransactions(filters),
    }),
};
