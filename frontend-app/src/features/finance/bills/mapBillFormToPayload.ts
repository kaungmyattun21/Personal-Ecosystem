import { BillFormValues } from "./billFormSchema";

/**
 * Maps validated form values to the shape expected by the API for bills.
 * - Converts simple date strings into full ISO timestamps.
 * - Handles optional category association, ensuring "none" or empty strings are nulled.
 */
export function mapBillFormToPayload(values: BillFormValues) {
  return {
    ...values,
    dueDate: new Date(values.dueDate).toISOString(),
    categoryId: values.categoryId === "none" || !values.categoryId ? null : values.categoryId,
  };
}
