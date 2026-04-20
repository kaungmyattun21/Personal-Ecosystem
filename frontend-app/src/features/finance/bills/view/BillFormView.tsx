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
import { BillFormContext } from "../hooks/useBillForm";
import { BillFrequencySelector } from "../components/BillFrequencySelector";
import { BillCategorySelector } from "../components/BillCategorySelector";

interface BillFormViewProps extends Omit<
  BillFormContext,
  "isOpen" | "onClose"
> {
  // Add any additional view-only props here if needed
}

/**
 * Main View for Bill Form.
 *
 * Orchestrates modular form sections for creating or editing recurring expenses.
 */
export function BillFormView({
  form,
  isEditMode,
  isPending,
  availableCategories,
  onSubmit,
}: BillFormViewProps) {
  const { register, handleSubmit } = form;

  return (
    <DialogContent className="sm:max-w-[425px] p-0 overflow-hidden border-none rounded-[32px] shadow-2xl bg-card">
      <DialogHeader className="p-8 pb-0">
        <DialogTitle className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          {isEditMode ? "Edit Bill" : "Add New Bill"}
        </DialogTitle>
        <DialogDescription className="sr-only">
          Setup a recurring or one-time bill.
        </DialogDescription>
      </DialogHeader>

      <FormProvider {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6">
          {/* Bill Name Field */}
          <FormField name="name" label="Bill Name">
            <Input
              {...register("name")}
              placeholder="e.g. Netflix Subscription"
              className="h-12 bg-slate-50 dark:bg-white/5 border-none rounded-xl px-4 text-sm focus-visible:ring-brand-teal text-slate-900 dark:text-white"
            />
          </FormField>

          <div className="grid grid-cols-2 gap-4">
            {/* Amount Field */}
            <FormField name="amount" label="Amount">
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

            <BillFrequencySelector />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Due Date Field */}
            <FormField name="dueDate" label="First Due Date">
              <Input
                type="date"
                {...register("dueDate")}
                className="h-12 rounded-xl border-none bg-slate-50 dark:bg-white/5 px-4 text-slate-900 dark:text-white"
              />
            </FormField>

            <BillCategorySelector categories={availableCategories} />
          </div>

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
                  : "Create Bill"}
            </Button>
          </div>
        </form>
      </FormProvider>
    </DialogContent>
  );
}
