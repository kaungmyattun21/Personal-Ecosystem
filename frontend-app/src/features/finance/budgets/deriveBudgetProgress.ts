import { Budget } from "@/types/finance";

export type BudgetStatus = "safe" | "warning" | "critical";

export interface BudgetWithProgress extends Budget {
  actual: number;
  percentage: number;
  status: BudgetStatus;
  subBudgets?: BudgetWithProgress[];
}

const WARNING_THRESHOLD = 80;
const CRITICAL_THRESHOLD = 100;

export function resolveBudgetStatus(percentage: number): BudgetStatus {
  if (percentage >= CRITICAL_THRESHOLD) return "critical";
  if (percentage >= WARNING_THRESHOLD) return "warning";
  return "safe";
}

export function toBudgetProgress(
  budget: Budget & { actual?: number },
): BudgetWithProgress {
  const actual = budget.actual ?? 0;
  const amount = parseFloat(budget.amount);
  const percentage = amount > 0 ? (actual / amount) * 100 : 0;

  return {
    ...budget,
    actual,
    percentage,
    status: resolveBudgetStatus(percentage),
    subBudgets: budget.subBudgets?.map(toBudgetProgress),
  };
}

export function budgetLabel(budget: Budget): string {
  return budget.name || budget.category?.name || "Budget";
}
