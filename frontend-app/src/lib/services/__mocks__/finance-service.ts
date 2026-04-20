import { vi } from 'vitest';

export const financeService = {
  getAccounts: vi.fn().mockResolvedValue([]),
  getCategories: vi.fn().mockResolvedValue([]),
  createTransaction: vi.fn(),
  updateTransaction: vi.fn(),
  deleteTransaction: vi.fn(),
  getTransactions: vi.fn().mockResolvedValue([]),
  bulkDeleteTransactions: vi.fn(),

  getBudgets: vi.fn().mockResolvedValue([]),
  createBudget: vi.fn(),
  updateBudget: vi.fn(),
  deleteBudget: vi.fn(),
  bulkDeleteBudgets: vi.fn(),

  getBills: vi.fn().mockResolvedValue([]),
  createBill: vi.fn(),
  updateBill: vi.fn(),
  deleteBill: vi.fn(),

  getSavingGoals: vi.fn().mockResolvedValue([]),
  getSavingGoal: vi.fn(),
  createSavingGoal: vi.fn(),
  updateSavingGoal: vi.fn(),
  deleteSavingGoal: vi.fn(),
  createSavingContribution: vi.fn(),
  getSavingContributions: vi.fn().mockResolvedValue([]),
};
