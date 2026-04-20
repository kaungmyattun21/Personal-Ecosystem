import { z } from "zod";

export const billFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  amount: z.coerce.number().positive("Amount must be positive"),
  categoryId: z.string().optional().nullable(),
  dueDate: z.string().min(1, "Due date is required"),
  frequency: z.enum(["ONCE", "MONTHLY", "WEEKLY", "YEARLY"]),
});

export type BillFormValues = z.infer<typeof billFormSchema>;

export const BILL_CREATE_DEFAULTS: Partial<BillFormValues> = {
  name: "",
  amount: 0,
  categoryId: null,
  dueDate: new Date().toISOString().split("T")[0],
  frequency: "MONTHLY",
};
