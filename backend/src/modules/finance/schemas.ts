import { z } from "zod";

export const createAccountSchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.enum(["CHECKING", "SAVINGS", "CASH", "CREDIT", "OTHER"]),
  balance: z.number().default(0),
  currency: z.string().length(3).default("USD"),
});

export const updateAccountSchema = z.object({
  name: z.string().min(1).optional(),
  type: z.enum(["CHECKING", "SAVINGS", "CASH", "CREDIT", "OTHER"]).optional(),
  balance: z.number().optional(),
  currency: z.string().length(3).optional(),
});

export const createCategorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.enum(["INCOME", "EXPENSE", "TRANSFER"]),
  color: z.string().optional(),
  icon: z.string().optional(),
});

export const updateCategorySchema = z.object({
  name: z.string().min(1).optional(),
  type: z.enum(["INCOME", "EXPENSE", "TRANSFER"]).optional(),
  color: z.string().optional(),
  icon: z.string().optional(),
});

export const createTransactionSchema = z.object({
  accountId: z.string().cuid("Invalid account ID").optional().nullable(), // TODO: re-enable as required when account selection is re-added
  categoryId: z.string().cuid("Invalid category ID").optional().nullable(), // TODO: re-enable when category selection is re-added
  amount: z.number(),
  type: z.enum(["INCOME", "EXPENSE", "TRANSFER"]),
  date: z.string().datetime().optional().or(z.date().optional()),
  description: z.string().optional(),
  metadata: z.any().optional(),
  billId: z.string().cuid().optional().nullable(),
  budgetId: z.string().cuid().optional().nullable(),
  savingGoalId: z.string().cuid().optional().nullable(),
});

export const updateTransactionSchema = z.object({
  accountId: z.string().cuid().optional(),
  categoryId: z.string().cuid().optional().nullable(),
  amount: z.number().optional(),
  type: z.enum(["INCOME", "EXPENSE", "TRANSFER"]).optional(),
  date: z.string().datetime().optional().or(z.date().optional()),
  description: z.string().optional(),
  metadata: z.any().optional(),
  billId: z.string().cuid().optional().nullable(),
  budgetId: z.string().cuid().optional().nullable(),
  savingGoalId: z.string().cuid().optional().nullable(),
});

export const createBudgetSchema = z.object({
  categoryId: z.string().cuid("Invalid category ID"),
  name: z.string().optional().nullable(),
  amount: z.coerce.number().positive(),
  period: z.enum(["MONTHLY", "WEEKLY", "YEARLY"]),
  startDate: z.string().or(z.date()),
  endDate: z.string().optional().nullable().or(z.date().optional().nullable()),
  parentId: z.string().cuid().optional().nullable(),
});

export const updateBudgetSchema = z.object({
  categoryId: z.string().cuid().optional(),
  name: z.string().optional().nullable(),
  amount: z.coerce.number().positive().optional(),
  period: z.enum(["MONTHLY", "WEEKLY", "YEARLY"]).optional(),
  startDate: z.string().datetime().optional().or(z.date().optional()),
  endDate: z
    .string()
    .datetime()
    .optional()
    .nullable()
    .or(z.date().optional().nullable()),
  parentId: z.string().cuid().optional().nullable(),
});

export const createBillSchema = z.object({
  categoryId: z.string().cuid().optional().nullable(),
  name: z.string().min(1, "Name is required"),
  amount: z.number().positive(),
  dueDate: z.string().datetime().or(z.date()),
  frequency: z.enum(["ONCE", "MONTHLY", "WEEKLY", "YEARLY"]),
});

export const updateBillSchema = z.object({
  categoryId: z.string().cuid().optional().nullable(),
  name: z.string().min(1).optional(),
  amount: z.number().positive().optional(),
  dueDate: z.string().datetime().optional().or(z.date().optional()),
  frequency: z.enum(["ONCE", "MONTHLY", "WEEKLY", "YEARLY"]).optional(),
  status: z.enum(["PAID", "UNPAID", "OVERDUE"]).optional(),
});

export const createSavingGoalSchema = z.object({
  name: z.string().min(1, "Name is required"),
  targetAmount: z.coerce.number().positive(),
  currentAmount: z.coerce.number().min(0).default(0),
  targetDate: z.string().datetime().optional().nullable().or(z.date().optional().nullable()),
  color: z.string().optional().nullable(),
  icon: z.string().optional().nullable(),
});

export const updateSavingGoalSchema = z.object({
  name: z.string().min(1).optional(),
  targetAmount: z.coerce.number().positive().optional(),
  currentAmount: z.coerce.number().min(0).optional(),
  targetDate: z.string().datetime().optional().nullable().or(z.date().optional().nullable()),
  color: z.string().optional().nullable(),
  icon: z.string().optional().nullable(),
  status: z.enum(["IN_PROGRESS", "REACHED", "PAUSED"]).optional(),
});

export const createSavingContributionSchema = z.object({
  savingGoalId: z.string().cuid("Invalid saving goal ID"),
  amount: z.coerce.number().positive(),
  source: z.enum(["INCOME", "MANUAL", "TRANSFER"]),
  description: z.string().optional(),
  date: z.string().datetime().optional().nullable().or(z.date().optional().nullable()),
});

export const bulkDeleteSchema = z.object({
  ids: z.array(z.string()),
});
