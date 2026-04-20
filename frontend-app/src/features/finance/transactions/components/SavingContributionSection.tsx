"use client";

import React from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { DollarSign } from "lucide-react";
import { TransactionFormValues } from "../transactionFormSchema";

export function SavingContributionSection() {
  const { control, setValue, register } = useFormContext<TransactionFormValues>();
  const selectedType = useWatch({ control, name: "type" });
  const amount = useWatch({ control, name: "amount" });
  const savingAmount = useWatch({ control, name: "savingAmount" });

  if (selectedType !== "INCOME") return null;

  const percentages = [10, 20, 30, 40, 50];

  const handlePercentageClick = (percentage: number) => {
    const calculatedAmount = (Number(amount) * percentage) / 100;
    setValue("savingAmount", Number(calculatedAmount.toFixed(2)));
  };

  return (
    <div className="space-y-4 pt-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
          Auto-Saving Plan
        </span>
        <span className="text-[10px] font-black uppercase tracking-widest text-brand-teal/60">
          Secure wealth
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        {percentages.map((p) => {
          const isActive = Number(savingAmount) === Number(((Number(amount) * p) / 100).toFixed(2));
          return (
            <Button
              key={p}
              type="button"
              variant="outline"
              onClick={() => handlePercentageClick(p)}
              className={cn(
                "h-12 px-6 rounded-2xl border-none font-black text-xs transition-all",
                isActive
                  ? "bg-slate-900 text-white shadow-lg shadow-slate-900/10"
                  : "bg-slate-100 dark:bg-white/5 text-slate-500 hover:bg-slate-200"
              )}
            >
              {p}%
            </Button>
          );
        })}
      </div>

      <FormField name="savingAmount" label="Saving Amount (Manual)">
        <div className="relative group">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900 transition-colors">
            <DollarSign className="h-5 w-5" />
          </span>
          <Input
            {...register("savingAmount")}
            type="number"
            step="0.01"
            className="h-14 bg-slate-50 dark:bg-white/5 border-none rounded-2xl pl-12 text-base font-medium text-slate-900 dark:text-white focus-visible:ring-1 focus-visible:ring-slate-200"
            placeholder="0.00"
          />
        </div>
      </FormField>
    </div>
  );
}
