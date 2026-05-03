import { GroceryItem } from "@/types/kitchen";

export function mapGroceryToFormValues(item: GroceryItem) {
  return {
    name: item.name,
    category: item.category ?? "",
    quantity: item.quantity,
    unit: item.unit ?? "",
    expiryDate: item.expiryDate ? new Date(item.expiryDate).toISOString().split("T")[0] : "",
  };
}
