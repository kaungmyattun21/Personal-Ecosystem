"use client";

import React from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { FormField } from "@/components/ui/form-field";
import { AppSelect, SelectOption } from "@/components/ui/app-select";
import { SavingGoal } from "@/types/finance";
import { TransactionFormValues } from "../transactionFormSchema";

export function SavingGoalSelector({ savingGoals }: { savingGoals: SavingGoal[] }) {
  const { control, setValue } = useFormContext<TransactionFormValues>();
  const selectedType = useWatch({ control, name: "type" });
  const selectedSavingGoalId = useWatch({ control, name: "savingGoalId" });

  const activeGoals = (savingGoals || []).filter((goal) => goal.status !== "REACHED");
  const isIncome = selectedType === "INCOME";

  if (!isIncome || activeGoals.length === 0) return null;

  const options: SelectOption[] = activeGoals.map((goal) => ({
    id: goal.id,
    label: goal.name,
  }));

  return (
    <FormField name="savingGoalId" label="Saving Goal (Optional)">
      <AppSelect
        value={selectedSavingGoalId || ""}
        onValueChange={(val) => setValue("savingGoalId", val)}
        options={options}
        placeholder="Contribute to a goal"
        unselectedLabel="No goal"
        triggerClassName="h-14 bg-slate-50 dark:bg-white/5 border-none rounded-2xl px-6 text-base font-medium text-slate-900 dark:text-white"
      />
    </FormField>
  );
}
