import { z } from "zod";

export const TRANSACTION_TYPES = ["INCOME", "EXPENSE", "TRANSFER"] as const;
export type TransactionType = (typeof TRANSACTION_TYPES)[number];

export const transactionFormSchema = z.object({
  type: z.enum(TRANSACTION_TYPES),
  amount: z.coerce.number().positive("Amount must be greater than 0"),
  date: z.string().min(1, "Date is required"),
  description: z.string().optional(),
  categoryId: z.string().optional(),
  budgetId: z.string().optional(),
  savingGoalId: z.string().optional(),
  savingAmount: z.coerce.number().min(0).optional(),
  accountId: z.string().min(1, "Account is required"),
  applyAsContribution: z.boolean().default(false),
});

export type TransactionFormValues = z.infer<typeof transactionFormSchema>;

export const CREATE_DEFAULTS: TransactionFormValues = {
  type: "EXPENSE",
  amount: 0,
  date: new Date().toISOString().split("T")[0],
  description: "",
  categoryId: "",
  budgetId: "",
  savingGoalId: "",
  savingAmount: 0,
  accountId: "",
  applyAsContribution: false,
};
