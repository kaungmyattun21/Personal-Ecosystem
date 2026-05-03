import { CreateShoppingListInput } from "@/types/kitchen";

export function mapShoppingListFormToPayload(values: any): CreateShoppingListInput {
  return {
    name: values.name,
    status: values.status,
  };
}
