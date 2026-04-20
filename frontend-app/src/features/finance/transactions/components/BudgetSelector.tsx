"use client";

import React from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { FormField } from "@/components/ui/form-field";
import { AppSelect, SelectOption } from "@/components/ui/app-select";
import { Budget } from "@/types/finance";
import { TransactionFormValues } from "../transactionFormSchema";
import { useBudgetSelection } from "../hooks/useBudgetSelection";

export function BudgetSelector({ budgets }: { budgets: Budget[] }) {
  const { control } = useFormContext<TransactionFormValues>();
  const selectedType = useWatch({ control, name: "type" });
  const selectedCategoryId = useWatch({ control, name: "categoryId" });

  const { filteredBudgets, selectableLeafBudgets, currentBudgetId, setBudgetId } =
    useBudgetSelection(budgets, selectedCategoryId);

  if (selectedType !== "EXPENSE" || !budgets || budgets.length === 0) return null;

  const isFilterActive = !!selectedCategoryId;

  const options: SelectOption[] = [];
  filteredBudgets.forEach((budget) => {
    const subBudgets = budget.subBudgets || [];
    const hasChildren = subBudgets.length > 0;

    if (hasChildren) {
      options.push({
        id: `header-${budget.id}`,
        label: budget.name || budget.category?.name || "Group",
        isHeader: true,
      });
      subBudgets.forEach((subBudget) => {
        options.push({
          id: subBudget.id,
          label: subBudget.name || subBudget.category?.name || "Sub-budget",
          isIndented: true,
        });
      });
    } else {
      options.push({
        id: budget.id,
        label: budget.name || budget.category?.name || "Unnamed Budget",
      });
    }
  });

  return (
    <FormField
      name="budgetId"
      label={
        isFilterActive && selectableLeafBudgets.length > 0
          ? "Target Sub-Budget"
          : "Budget (Optional)"
      }
    >
      <AppSelect
        value={currentBudgetId || ""}
        onValueChange={setBudgetId}
        options={options}
        placeholder="Assign to sub-budget"
        unselectedLabel={isFilterActive ? "Unbudgeted" : "Keep unbudgeted"}
        triggerClassName="h-14 bg-slate-50 dark:bg-white/5 border-none rounded-2xl px-6 text-base font-medium text-slate-900 dark:text-white"
      />
    </FormField>
  );
}
