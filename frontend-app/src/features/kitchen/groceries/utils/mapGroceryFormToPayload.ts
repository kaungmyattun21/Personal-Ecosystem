import { CreateGroceryItemInput } from "@/types/kitchen";

export function mapGroceryFormToPayload(values: any): CreateGroceryItemInput {
  return {
    name: values.name,
    category: values.category || null,
    quantity: Number(values.quantity),
    unit: values.unit || null,
    expiryDate: values.expiryDate ? new Date(values.expiryDate).toISOString() : null,
  };
}
