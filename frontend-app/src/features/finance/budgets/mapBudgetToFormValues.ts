import { Budget as BudgetType } from "@/types/finance";
import { BudgetFormValues } from "./budgetFormSchema";

export function mapBudgetToFormValues(budget: BudgetType): BudgetFormValues {
  return {
    name: budget.name || "",
    amount: parseFloat(budget.amount),
    categoryId: budget.categoryId,
    period: budget.period,
    startDate: budget.startDate.split("T")[0],
    endDate: budget.endDate ? budget.endDate.split("T")[0] : null,
    parentId: budget.parentId || null,
  };
}
