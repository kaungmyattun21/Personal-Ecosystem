import { apiClient } from "../api-client";
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
  getAccounts: async () => {
    const { data } = await apiClient.get<Account[]>("/finance/accounts");
    return data;
  },

  // Categories
  getCategories: async () => {
    const { data } = await apiClient.get<Category[]>("/finance/categories");
    return data;
  },

  // Transactions
  getTransactions: async (params?: TransactionFilterParams) => {
    const { data } = await apiClient.get<Transaction[]>(
      "/finance/transactions",
      { params },
    );
    return data;
  },
  createTransaction: async (txData: Partial<Transaction>) => {
    const { data } = await apiClient.post<Transaction>(
      "/finance/transactions",
      txData,
    );
    return data;
  },
  updateTransaction: async (id: string, txData: Partial<Transaction>) => {
    const { data } = await apiClient.put<Transaction>(
      `/finance/transactions/${id}`,
      txData,
    );
    return data;
  },
  deleteTransaction: async (id: string) => {
    await apiClient.delete(`/finance/transactions/${id}`);
  },
  bulkDeleteTransactions: async (ids: string[]) => {
    await apiClient.post("/finance/transactions/bulk-delete", { ids });
  },

  // Budgets
  getBudgets: async () => {
    const { data } = await apiClient.get<Budget[]>("/finance/budgets");
    return data;
  },
  createBudget: async (budgetData: Partial<Budget>) => {
    const { data } = await apiClient.post<Budget>(
      "/finance/budgets",
      budgetData,
    );
    return data;
  },
  updateBudget: async (id: string, budgetData: Partial<Budget>) => {
    const { data } = await apiClient.put<Budget>(
      `/finance/budgets/${id}`,
      budgetData,
    );
    return data;
  },
  deleteBudget: async (id: string) => {
    await apiClient.delete(`/finance/budgets/${id}`);
  },
  bulkDeleteBudgets: async (ids: string[]) => {
    await apiClient.post("/finance/budgets/bulk-delete", { ids });
  },

  // Bills
  getBills: async () => {
    const { data } = await apiClient.get<Bill[]>("/finance/bills");
    return data;
  },
  createBill: async (billData: Partial<Bill>) => {
    const { data } = await apiClient.post<Bill>("/finance/bills", billData);
    return data;
  },
  updateBill: async (id: string, billData: Partial<Bill>) => {
    const { data } = await apiClient.put<Bill>(
      `/finance/bills/${id}`,
      billData,
    );
    return data;
  },
  deleteBill: async (id: string) => {
    await apiClient.delete(`/finance/bills/${id}`);
  },

  // Saving Goals
  getSavingGoals: async () => {
    const { data } = await apiClient.get<SavingGoal[]>("/finance/goals");
    return data;
  },
  createSavingGoal: async (goalData: Partial<SavingGoal>) => {
    const { data } = await apiClient.post<SavingGoal>(
      "/finance/goals",
      goalData,
    );
    return data;
  },
  updateSavingGoal: async (id: string, goalData: Partial<SavingGoal>) => {
    const { data } = await apiClient.put<SavingGoal>(
      `/finance/goals/${id}`,
      goalData,
    );
    return data;
  },
  deleteSavingGoal: async (id: string) => {
    await apiClient.delete(`/finance/goals/${id}`);
  },
  getSavingContributions: async (goalId: string) => {
    const { data } = await apiClient.get<SavingContribution[]>(
      `/finance/goals/${goalId}/contributions`,
    );
    return data;
  },
  createSavingContribution: async (contributionData: any) => {
    const { data } = await apiClient.post<SavingContribution>(
      "/finance/goals/contributions",
      contributionData,
    );
    return data;
  },
};
