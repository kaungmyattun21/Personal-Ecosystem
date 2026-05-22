import { apiFetch } from "../api-client";
import {
  Account,
  Category,
  Transaction,
  Budget,
  Bill,
  SavingGoal,
  SavingContribution,
  TransactionFilterParams,
} from "../../types/finance";

export const financeService = {
  // Accounts
  getAccounts: () => apiFetch<Account[]>("/finance/accounts"),

  // Categories
  getCategories: () => apiFetch<Category[]>("/finance/categories"),

  // Transactions
  getTransactions: (params?: TransactionFilterParams) =>
    apiFetch<Transaction[]>("/finance/transactions", { params }),

  createTransaction: (txData: Partial<Transaction>) =>
    apiFetch<Transaction>("/finance/transactions", { method: "POST", body: txData }),

  updateTransaction: (id: string, txData: Partial<Transaction>) =>
    apiFetch<Transaction>(`/finance/transactions/${id}`, { method: "PUT", body: txData }),

  deleteTransaction: (id: string) =>
    apiFetch(`/finance/transactions/${id}`, { method: "DELETE" }),

  bulkDeleteTransactions: (ids: string[]) =>
    apiFetch("/finance/transactions/bulk-delete", { method: "POST", body: { ids } }),

  // Budgets
  getBudgets: () => apiFetch<Budget[]>("/finance/budgets"),

  createBudget: (budgetData: Partial<Budget>) =>
    apiFetch<Budget>("/finance/budgets", { method: "POST", body: budgetData }),

  updateBudget: (id: string, budgetData: Partial<Budget>) =>
    apiFetch<Budget>(`/finance/budgets/${id}`, { method: "PUT", body: budgetData }),

  deleteBudget: (id: string) =>
    apiFetch(`/finance/budgets/${id}`, { method: "DELETE" }),

  bulkDeleteBudgets: (ids: string[]) =>
    apiFetch("/finance/budgets/bulk-delete", { method: "POST", body: { ids } }),

  // Bills
  getBills: () => apiFetch<Bill[]>("/finance/bills"),

  createBill: (billData: Partial<Bill>) =>
    apiFetch<Bill>("/finance/bills", { method: "POST", body: billData }),

  updateBill: (id: string, billData: Partial<Bill>) =>
    apiFetch<Bill>(`/finance/bills/${id}`, { method: "PUT", body: billData }),

  deleteBill: (id: string) =>
    apiFetch(`/finance/bills/${id}`, { method: "DELETE" }),

  // Saving Goals
  getSavingGoals: () => apiFetch<SavingGoal[]>("/finance/goals"),

  createSavingGoal: (goalData: Partial<SavingGoal>) =>
    apiFetch<SavingGoal>("/finance/goals", { method: "POST", body: goalData }),

  updateSavingGoal: (id: string, goalData: Partial<SavingGoal>) =>
    apiFetch<SavingGoal>(`/finance/goals/${id}`, { method: "PUT", body: goalData }),

  deleteSavingGoal: (id: string) =>
    apiFetch(`/finance/goals/${id}`, { method: "DELETE" }),

  getSavingContributions: (goalId: string) =>
    apiFetch<SavingContribution[]>(`/finance/goals/${goalId}/contributions`),

  createSavingContribution: (contributionData: any) =>
    apiFetch<SavingContribution>("/finance/goals/contributions", {
      method: "POST",
      body: contributionData,
    }),
};
