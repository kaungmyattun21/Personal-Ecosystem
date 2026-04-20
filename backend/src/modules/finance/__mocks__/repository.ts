import { vi } from 'vitest';

export const createAccount = vi.fn();
export const findAccountsByUserId = vi.fn().mockResolvedValue([]);
export const findAccountById = vi.fn();
export const updateAccount = vi.fn();
export const deleteAccount = vi.fn();

export const createCategory = vi.fn();
export const findCategoriesByUserId = vi.fn().mockResolvedValue([]);
export const findCategoryById = vi.fn();
export const updateCategory = vi.fn();
export const deleteCategory = vi.fn();

export const createTransaction = vi.fn();
export const findTransactionsByUserId = vi.fn().mockResolvedValue([]);
export const findTransactionById = vi.fn();
export const findTransactions = vi.fn().mockResolvedValue([]);
export const updateTransaction = vi.fn();
export const deleteTransaction = vi.fn();
export const deleteTransactions = vi.fn();

export const createBudget = vi.fn();
export const findBudgetsByUserId = vi.fn().mockResolvedValue([]);
export const findBudgetById = vi.fn();
export const findBudgets = vi.fn().mockResolvedValue([]);
export const updateBudget = vi.fn();
export const deleteBudget = vi.fn();
export const deleteBudgets = vi.fn();
export const findBudgetsByParentId = vi.fn().mockResolvedValue([]);

export const createBill = vi.fn();
export const findBillsByUserId = vi.fn().mockResolvedValue([]);
export const findBillById = vi.fn();
export const updateBill = vi.fn();
export const deleteBill = vi.fn();

export const createSavingGoal = vi.fn();
export const findSavingGoalsByUserId = vi.fn().mockResolvedValue([]);
export const findSavingGoalById = vi.fn();
export const updateSavingGoal = vi.fn();
export const deleteSavingGoal = vi.fn();

export const createSavingContribution = vi.fn();
export const findSavingContributionsByGoalId = vi.fn().mockResolvedValue([]);

export const runInTransaction = vi.fn(async (cb) => cb({
  account: { findMany: vi.fn(), create: vi.fn(), update: vi.fn() },
  budget: { findMany: vi.fn(), update: vi.fn() },
  transaction: { create: vi.fn(), update: vi.fn(), findFirst: vi.fn(), delete: vi.fn(), findMany: vi.fn(), deleteMany: vi.fn() },
  bill: { update: vi.fn() },
  savingGoal: { findFirst: vi.fn(), update: vi.fn() },
  savingContribution: { create: vi.fn() }
}));
