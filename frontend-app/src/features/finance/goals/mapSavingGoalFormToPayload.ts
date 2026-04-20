import { SavingGoalFormValues } from "./savingGoalFormSchema";

/**
 * Maps validated form values to the shape expected by the API for saving goals.
 * - Converts number strings to primitive strings for potential Decimals on backend.
 * - Handles optional target date ISO conversion.
 */
export function mapSavingGoalFormToPayload(values: SavingGoalFormValues) {
  return {
    ...values,
    targetAmount: values.targetAmount.toString(),
    currentAmount: (values.currentAmount || 0).toString(),
    targetDate: values.targetDate ? new Date(values.targetDate).toISOString() : null,
  };
}
