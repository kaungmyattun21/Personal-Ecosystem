import { z } from "zod";

export const savingGoalFormSchema = z.object({
  name: z.string().min(1, "Goal name is required"),
  targetAmount: z.coerce.number().positive("Target amount must be positive"),
  currentAmount: z.coerce.number().min(0).default(0),
  targetDate: z.string().optional().nullable(),
  color: z.string().optional().nullable(),
  icon: z.string().optional().nullable(),
});

export type SavingGoalFormValues = z.infer<typeof savingGoalFormSchema>;
