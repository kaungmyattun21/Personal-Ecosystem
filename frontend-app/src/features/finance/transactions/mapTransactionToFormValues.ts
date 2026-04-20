import { Transaction } from "@/types/finance";
import { TransactionFormValues } from "./transactionFormSchema";

/**
 * Maps an existing Transaction domain object to form-compatible values
 * for pre-filling the form in edit mode.
 */
export function mapTransactionToFormValues(
  tx: Transaction,
): TransactionFormValues {
  return {
    type: tx.type as TransactionFormValues["type"],
    amount: Math.abs(parseFloat(tx.amount)),
    date: new Date(tx.date).toISOString().split("T")[0],
    description: tx.description ?? "",
    categoryId: tx.categoryId ?? "",
    budgetId: tx.budgetId ?? "",
    savingGoalId: tx.savingGoalId ?? "",
    accountId: tx.accountId,
    applyAsContribution: false,
  };
}
