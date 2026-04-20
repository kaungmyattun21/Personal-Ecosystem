import { TransactionFormValues } from "./transactionFormSchema";

/**
 * Maps validated form values to the shape expected by the API.
 * - amount is already a number (coerced by Zod)
 * - date is converted to full ISO datetime
 * - empty optional strings are omitted to avoid backend CUID validation failures
 */
export function mapTransactionFormToPayload(values: TransactionFormValues) {
  return {
    type: values.type,
    amount: values.amount,
    date: new Date(values.date).toISOString(),
    accountId: values.accountId,
    ...(values.description?.trim()
      ? { description: values.description.trim() }
      : {}),
    ...(values.categoryId ? { categoryId: values.categoryId } : {}),
    ...(values.budgetId ? { budgetId: values.budgetId } : {}),
    ...(values.savingGoalId ? { savingGoalId: values.savingGoalId } : {}),
  };
}
