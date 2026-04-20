import { Bill } from "@/types/finance";
import { BillFormValues } from "./billFormSchema";

export function mapBillToFormValues(bill: Bill): BillFormValues {
  return {
    name: bill.name,
    amount: parseFloat(bill.amount),
    categoryId: bill.categoryId || null,
    dueDate: bill.dueDate.split("T")[0],
    frequency: bill.frequency,
  };
}
