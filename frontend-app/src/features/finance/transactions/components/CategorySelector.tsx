"use client";

import React from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { Tag } from "lucide-react";
import { FormField } from "@/components/ui/form-field";
import { AppSelect, SelectOption } from "@/components/ui/app-select";
import { Category } from "@/types/finance";
import { TransactionFormValues } from "../transactionFormSchema";

export function CategorySelector({ categories }: { categories: Category[] }) {
  const { control, setValue } = useFormContext<TransactionFormValues>();
  const selectedType = useWatch({ control, name: "type" });
  const selectedCategoryId = useWatch({ control, name: "categoryId" });

  const filteredCategories = (categories || []).filter(
    (cat) => cat.type === selectedType,
  );

  if (filteredCategories.length === 0) return null;

  const options: SelectOption[] = filteredCategories.map((category) => ({
    id: category.id,
    label: category.name,
    color: category.color || "#ccc",
  }));

  return (
    <FormField name="categoryId" label="Category">
      <div className="relative group">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-emerald transition-colors z-10">
          <Tag className="h-4 w-4" strokeWidth={2} />
        </span>
        <AppSelect
          value={selectedCategoryId || ""}
          onValueChange={(val) => setValue("categoryId", val)}
          options={options}
          placeholder="Select a category"
          unselectedLabel="Uncategorized"
          triggerClassName="h-12 bg-slate-50 dark:bg-white/5 border-none rounded-2xl pl-10 text-sm font-medium text-slate-900 dark:text-white focus:ring-1 focus:ring-brand-emerald/30"
        />
      </div>
    </FormField>
  );
}
