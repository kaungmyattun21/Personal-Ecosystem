"use client";

import React from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { FormField } from "@/components/ui/form-field";
import { AppSelect, SelectOption } from "@/components/ui/app-select";
import { Category } from "@/types/finance";
import { BillFormValues } from "../billFormSchema";

export function BillCategorySelector({
  categories,
}: {
  categories: Category[];
}) {
  const { control, setValue } = useFormContext<BillFormValues>();
  const selectedCategoryId = useWatch({ control, name: "categoryId" });

  const expenseCategories = categories.filter((cat) => cat.type === "EXPENSE");

  const options: SelectOption[] = expenseCategories.map((cat) => ({
    id: cat.id,
    label: cat.name,
    color: cat.color || "#ccc",
  }));

  return (
    <FormField name="categoryId" label="Category (Optional)">
      <AppSelect
        value={selectedCategoryId || ""}
        onValueChange={(val) => setValue("categoryId", val || null)}
        options={options}
        placeholder="Select category"
        unselectedLabel="None"
      />
    </FormField>
  );
}
