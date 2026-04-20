import { BudgetFormValues } from "./budgetFormSchema";

/**
 * Maps validated form values to the shape expected by the API.
 * - Handles ISO date conversions for frontend-friendly date strings.
 * - Ensures parentId is properly handled and cleans up empty strings.
 */
export function mapBudgetFormToPayload(values: BudgetFormValues) {
  return {
    ...values,
    startDate: new Date(values.startDate).toISOString(),
    endDate: values.endDate ? new Date(values.endDate).toISOString() : null,
    parentId: values.parentId || null,
    ...(values.name?.trim() ? { name: values.name.trim() } : {}),
  };
}
