"use client";

import React from "react";
import { FormProvider } from "react-hook-form";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { BudgetFormContext } from "../hooks/useBudgetForm";
import { BudgetCategorySelector } from "../components/BudgetCategorySelector";
import { BudgetPeriodSelector } from "../components/BudgetPeriodSelector";
import { ParentBudgetSelector } from "../components/ParentBudgetSelector";

interface BudgetFormViewProps extends Omit<
  BudgetFormContext,
  "isOpen" | "onClose"
> {
  // Add any additional view-only props here if needed
}

/**
 * Main View for Budget Form
 *
 * Orchestrates modular form sections and global UI patterns for budgets.
 */
export function BudgetFormView({
  form,
  isEditMode,
  isPending,
  availableBudgets,
  availableCategories,
  onSubmit,
}: BudgetFormViewProps) {
  const { register, handleSubmit } = form;

  return (
    <DialogContent className="max-w-md rounded-[40px] border border-brand-emerald/20 dark:border-brand-emerald/20 bg-white/80 dark:bg-brand-bg-dark/80 backdrop-blur-2xl shadow-lg p-0 overflow-hidden max-h-[90vh] flex flex-col">
      <DialogHeader className="p-8 pb-0">
        <DialogTitle className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          {isEditMode ? "Edit Budget" : "Create New Budget"}
        </DialogTitle>
        <DialogDescription className="sr-only">
          Fill in the name, amount, and category to set up a new spending limit.
        </DialogDescription>
      </DialogHeader>

      <FormProvider {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6">
          {/* Budget Name Field */}
          <FormField name="name" label="Budget Name">
            <Input
              {...register("name")}
              placeholder="e.g. Household & Maintenance"
              className="h-12 bg-slate-50 dark:bg-white/5 border-none rounded-xl px-4 text-sm focus-visible:ring-brand-teal text-slate-900 dark:text-white"
            />
          </FormField>

          <div className="grid grid-cols-2 gap-4">
            {/* Amount Field */}
            <FormField name="amount" label="Limit Amount">
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">
                  $
                </span>
                <Input
                  type="number"
                  step="0.01"
                  {...register("amount")}
                  className="h-12 bg-slate-50 dark:bg-white/5 border-none rounded-xl pl-8 pr-4 text-sm focus-visible:ring-brand-teal text-slate-900 dark:text-white"
                />
              </div>
            </FormField>

            <BudgetPeriodSelector />
          </div>

          <BudgetCategorySelector categories={availableCategories} />

          <ParentBudgetSelector datasets={availableBudgets} />

          {/* Form Actions */}
          <div className="pt-4 flex gap-3">
            <Button
              type="submit"
              disabled={isPending}
              className="flex-1 h-14 rounded-2xl bg-brand-teal hover:bg-brand-teal/90 text-white font-bold shadow-xl shadow-brand-teal/20"
            >
              {isPending
                ? isEditMode
                  ? "Saving..."
                  : "Creating..."
                : isEditMode
                  ? "Save Changes"
                  : "Create Budget"}
            </Button>
          </div>
        </form>
      </FormProvider>
    </DialogContent>
  );
}
