import * as z from "zod";

export const shoppingListFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  status: z.enum(["ACTIVE", "ARCHIVED"]),
});

export type ShoppingListFormValues = z.infer<typeof shoppingListFormSchema>;

export const SHOPPING_LIST_FORM_DEFAULTS: ShoppingListFormValues = {
  name: "",
  status: "ACTIVE",
};
