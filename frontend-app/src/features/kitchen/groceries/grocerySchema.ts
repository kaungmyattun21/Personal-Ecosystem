import * as z from "zod";

export const groceryFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  category: z.string().optional(),
  quantity: z.number().min(0, "Quantity must be at least 0"),
  unit: z.string().optional(),
  expiryDate: z.string().optional(),
});

export type GroceryFormValues = z.infer<typeof groceryFormSchema>;

export const GROCERY_FORM_DEFAULTS: GroceryFormValues = {
  name: "",
  category: "",
  quantity: 1,
  unit: "",
  expiryDate: "",
};
