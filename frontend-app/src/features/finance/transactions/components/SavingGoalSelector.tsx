"use client";

import React from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { Target } from "lucide-react";
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
      <div className="relative group">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-emerald transition-colors z-10">
          <Target className="h-4 w-4" strokeWidth={2} />
        </span>
        <AppSelect
          value={selectedSavingGoalId || ""}
          onValueChange={(val) => setValue("savingGoalId", val)}
          options={options}
          placeholder="Contribute to a goal"
          unselectedLabel="No goal"
          triggerClassName="h-12 bg-slate-50 dark:bg-white/5 border-none rounded-2xl pl-10 text-sm font-medium text-slate-900 dark:text-white focus:ring-1 focus:ring-brand-emerald/30"
        />
      </div>
    </FormField>
  );
}
