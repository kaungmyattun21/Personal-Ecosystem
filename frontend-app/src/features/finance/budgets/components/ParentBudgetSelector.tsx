"use client";

import React, { useMemo } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { FormField } from "@/components/ui/form-field";
import { AppSelect, SelectOption } from "@/components/ui/app-select";
import { Budget } from "@/types/finance";
import { BudgetFormValues } from "../budgetFormSchema";

export function ParentBudgetSelector({ datasets }: { datasets: Budget[] }) {
  const { control, setValue } = useFormContext<BudgetFormValues>();
  const selectedParentId = useWatch({ control, name: "parentId" });

  const options: SelectOption[] = useMemo(
    () =>
      datasets.map((budget) => ({
        id: budget.id,
        label: budget.name || budget.category?.name || "Unnamed Budget",
      })),
    [datasets],
  );

  return (
    <FormField name="parentId" label="Parent Budget (Optional)">
      <AppSelect
        value={selectedParentId || ""}
        onValueChange={(val) => setValue("parentId", val || null)}
        options={options}
        placeholder="Parent (top-level if none)"
        unselectedLabel="None (Top Level)"
      />
    </FormField>
  );
}
