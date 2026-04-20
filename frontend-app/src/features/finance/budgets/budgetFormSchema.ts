import { z } from "zod";

export const budgetFormSchema = z.object({
  name: z.string().optional(),
  amount: z.coerce.number().positive("Amount must be positive"),
  categoryId: z.string().min(1, "Category is required"),
  period: z.enum(["MONTHLY", "WEEKLY", "YEARLY"]),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional().nullable(),
  parentId: z.string().optional().nullable(),
});

export type BudgetFormValues = z.infer<typeof budgetFormSchema>;

export const BUDGET_CREATE_DEFAULTS: Partial<BudgetFormValues> = {
  name: "",
  amount: 0,
  period: "MONTHLY",
  startDate: new Date().toISOString().split("T")[0],
  parentId: null,
};
