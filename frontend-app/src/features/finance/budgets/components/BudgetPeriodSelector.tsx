"use client";

import React from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { FormField } from "@/components/ui/form-field";
import { AppSelect, SelectOption } from "@/components/ui/app-select";
import { BudgetFormValues } from "../budgetFormSchema";

const PERIOD_OPTIONS: SelectOption[] = [
  { id: "WEEKLY", label: "Weekly" },
  { id: "MONTHLY", label: "Monthly" },
  { id: "YEARLY", label: "Yearly" },
];

export function BudgetPeriodSelector() {
  const { control, setValue } = useFormContext<BudgetFormValues>();
  const selectedPeriod = useWatch({ control, name: "period" });

  return (
    <FormField name="period" label="Period">
      <AppSelect
        value={selectedPeriod}
        onValueChange={(val) => setValue("period", val as any)}
        options={PERIOD_OPTIONS}
        placeholder="Period"
      />
    </FormField>
  );
}
