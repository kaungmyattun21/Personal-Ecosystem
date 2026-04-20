"use client";

import { useEffect, useMemo } from "react";
import { useController, useFormContext, useWatch } from "react-hook-form";
import { Budget } from "@/types/finance";
import { TransactionFormValues } from "../transactionFormSchema";

/**
 * Encapsulates the budget filtering and auto-selection logic for Transaction Form.
 *
 * Supports DRY by centralizing leaf budget finding and auto-selection based on category.
 */
export function useBudgetSelection(
  budgets: Budget[],
  selectedCategoryId?: string,
) {
  const { control, setValue } = useFormContext<TransactionFormValues>();
  const selectedType = useWatch({ control, name: "type" });
  const { field } = useController({ control, name: "budgetId" });

  const filteredBudgets = useMemo(() => {
    if (!selectedCategoryId) return budgets;

    return budgets.filter((budget) => {
      const isParentMatch = budget.categoryId === selectedCategoryId;
      const hasMatchingSubBudget = budget.subBudgets?.some(
        (sub) => sub.categoryId === selectedCategoryId,
      );
      return isParentMatch || hasMatchingSubBudget;
    });
  }, [budgets, selectedCategoryId]);

  const selectableLeafBudgets = useMemo(() => {
    const leaves: Budget[] = [];
    filteredBudgets.forEach((budget) => {
      const subBudgets = budget.subBudgets || [];
      if (subBudgets.length === 0) {
        leaves.push(budget);
      } else {
        subBudgets.forEach((subBudget) => {
          if (
            !selectedCategoryId ||
            subBudget.categoryId === selectedCategoryId
          ) {
            leaves.push(subBudget);
          }
        });
      }
    });
    return leaves;
  }, [filteredBudgets, selectedCategoryId]);

  useEffect(() => {
    const isExpense = selectedType === "EXPENSE";
    const hasCategory = !!selectedCategoryId;
    const singleMatchFound = selectableLeafBudgets.length === 1;
    const noBudgetSelected = !field.value;
    const noMatchesFound = selectableLeafBudgets.length === 0;

    if (isExpense && hasCategory && singleMatchFound && noBudgetSelected) {
      setValue("budgetId", selectableLeafBudgets[0].id);
    } else if (hasCategory && noMatchesFound && field.value) {
      setValue("budgetId", "");
    }
  }, [
    selectedCategoryId,
    selectableLeafBudgets,
    selectedType,
    setValue,
    field.value,
  ]);

  return {
    filteredBudgets,
    selectableLeafBudgets,
    currentBudgetId: field.value,
    setBudgetId: (id: string) => setValue("budgetId", id),
  };
}
