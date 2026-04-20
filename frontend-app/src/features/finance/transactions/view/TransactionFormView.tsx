"use client";

import React from "react";
import { FormProvider } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Check,
  Pencil,
  Store,
  DollarSign,
  Calendar,
  Tag,
  Wallet,
} from "lucide-react";
import { FormField } from "@/components/ui/form-field";
import { TransactionFormContext } from "../hooks/useTransactionForm";
import { TransactionTypeToggle } from "../components/TransactionTypeToggle";
import { CategorySelector } from "../components/CategorySelector";
import { BudgetSelector } from "../components/BudgetSelector";
import { SavingGoalSelector } from "../components/SavingGoalSelector";
import { SavingContributionSection } from "../components/SavingContributionSection";
import { AccountSelector } from "../components/AccountSelector";

interface TransactionFormViewProps extends Omit<
  TransactionFormContext,
  "isOpen" | "onClose"
> {
  // Any additional view-only props can go here
}

export function TransactionFormView({
  form,
  isEditMode,
  isPending,
  categories,
  budgets,
  savingGoals,
  accounts,
  onSubmit,
}: TransactionFormViewProps) {
  const { register, handleSubmit } = form;

  return (
    <FormProvider {...form}>
      <p className="sr-only">
        Enter details for your transaction to record income or expenses.
      </p>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="p-10 pt-4 space-y-8 overflow-y-auto custom-scrollbar flex-1"
      >
        <div className="space-y-8">
          <TransactionTypeToggle />

          {/* Description / Merchant Field */}
          <FormField name="description" label="Merchant / Source">
            <div className="relative group">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900 dark:group-focus-within:text-white transition-colors">
                <Store className="h-5 w-5" strokeWidth={2} />
              </span>
              <Input
                {...register("description")}
                className="h-14 bg-slate-50 dark:bg-white/5 border-none rounded-2xl pl-12 text-base font-medium text-slate-900 dark:text-white focus-visible:ring-1 focus-visible:ring-slate-200"
                placeholder="e.g. Starbucks, Target"
              />
            </div>
          </FormField>

          <div className="grid grid-cols-2 gap-4">
            {/* Amount Field */}
            <FormField name="amount" label="Amount">
              <div className="relative group">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900 dark:group-focus-within:text-white transition-colors">
                  <DollarSign className="h-5 w-5" strokeWidth={2} />
                </span>
                <Input
                  {...register("amount")}
                  className="h-14 bg-slate-50 dark:bg-white/5 border-none rounded-2xl pl-12 text-base font-medium text-slate-900 dark:text-white focus-visible:ring-1 focus-visible:ring-slate-200"
                  placeholder="0.00"
                />
              </div>
            </FormField>

            {/* Date Field */}
            <FormField name="date" label="Date">
              <div className="relative group">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900 dark:group-focus-within:text-white transition-colors">
                  <Calendar className="h-5 w-5" strokeWidth={2} />
                </span>
                <Input
                  type="date"
                  {...register("date")}
                  className="h-14 bg-slate-50 dark:bg-white/5 border-none rounded-2xl pl-12 text-base font-medium text-slate-900 dark:text-white focus-visible:ring-1 focus-visible:ring-slate-200"
                />
              </div>
            </FormField>
          </div>

          <CategorySelector categories={categories} />

          <AccountSelector accounts={accounts} />

          <div className="grid grid-cols-2 gap-4">
            <BudgetSelector budgets={budgets} />
            <SavingGoalSelector savingGoals={savingGoals} />
          </div>

          <SavingContributionSection />
        </div>

        {/* Form Actions */}
        <div className="pt-4 sticky bottom-0 bg-transparent">
          <Button
            type="submit"
            disabled={isPending}
            className="w-full h-16 rounded-2xl bg-slate-900 dark:bg-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 text-white font-black text-base shadow-xl transition-all active:scale-[0.98]"
          >
            {isPending
              ? isEditMode
                ? "Saving..."
                : "Creating..."
              : isEditMode
                ? "Save Changes"
                : "Add Transaction"}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
