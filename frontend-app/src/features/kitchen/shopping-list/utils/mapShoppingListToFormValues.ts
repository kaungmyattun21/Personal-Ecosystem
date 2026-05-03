import { ShoppingList } from "@/types/kitchen";

export function mapShoppingListToFormValues(list: ShoppingList) {
  return {
    name: list.name,
    status: list.status,
  };
}
