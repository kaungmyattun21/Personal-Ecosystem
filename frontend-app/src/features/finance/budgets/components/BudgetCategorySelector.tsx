"use client";

import React from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { FormField } from "@/components/ui/form-field";
import { AppSelect, SelectOption } from "@/components/ui/app-select";
import { Category } from "@/types/finance";
import { BudgetFormValues } from "../budgetFormSchema";

export function BudgetCategorySelector({
  categories,
}: {
  categories: Category[];
}) {
  const { control, setValue } = useFormContext<BudgetFormValues>();
  const selectedCategoryId = useWatch({ control, name: "categoryId" });

  const expenseCategories = categories.filter((cat) => cat.type === "EXPENSE");

  if (expenseCategories.length === 0) return null;

  const options: SelectOption[] = expenseCategories.map((cat) => ({
    id: cat.id,
    label: cat.name,
    color: cat.color || "#ccc",
  }));

  return (
    <FormField name="categoryId" label="Category">
      <AppSelect
        value={selectedCategoryId || ""}
        onValueChange={(val) => setValue("categoryId", val)}
        options={options}
        placeholder="Select category"
      />
    </FormField>
  );
}
