"use client";

import React, { useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { DollarSign } from "lucide-react";
import { TransactionFormValues } from "../transactionFormSchema";

const PERCENTAGES = [10, 20, 30, 40, 50];

export function SavingContributionSection() {
  const { control, setValue, register } = useFormContext<TransactionFormValues>();
  const selectedType = useWatch({ control, name: "type" });
  const amount = useWatch({ control, name: "amount" });
  const savingAmount = useWatch({ control, name: "savingAmount" });
  const [enabled, setEnabled] = useState(true);

  if (selectedType !== "INCOME") return null;

  const handlePercentageClick = (p: number) => {
    const calculated = parseFloat(((Number(amount) * p) / 100).toFixed(2));
    setValue("savingAmount", calculated);
  };

  const activePercentage = PERCENTAGES.find(
    (p) =>
      Number(savingAmount) ===
      parseFloat(((Number(amount) * p) / 100).toFixed(2)),
  );

  return (
    <div className="space-y-4">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
          Auto-Saving Plan
        </span>
        {/* Toggle + label */}
        <div className="flex items-center gap-2">
          <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
            Secure Wealth
          </span>
          <button
            type="button"
            onClick={() => setEnabled((v) => !v)}
            className={cn(
              "relative inline-flex h-5 w-9 shrink-0 rounded-full border-2 border-transparent transition-colors focus-visible:outline-none",
              enabled
                ? "bg-brand-teal dark:bg-brand-emerald"
                : "bg-slate-200 dark:bg-white/15",
            )}
          >
            <span
              className={cn(
                "pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform",
                enabled ? "translate-x-4" : "translate-x-0",
              )}
            />
          </button>
        </div>
      </div>

      {/* Percentage buttons */}
      <div className="flex gap-2 flex-wrap">
        {PERCENTAGES.map((p) => (
          <button
            key={p}
            type="button"
            disabled={!enabled}
            onClick={() => handlePercentageClick(p)}
            className={cn(
              "flex-1 h-10 rounded-xl text-xs font-black transition-all",
              activePercentage === p && enabled
                ? "bg-brand-teal text-white shadow-md shadow-brand-teal/20"
                : "bg-slate-100 dark:bg-white/6 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed",
            )}
          >
            {p}%
          </button>
        ))}
      </div>

      {/* Manual input */}
      <div className="space-y-1.5">
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
          Saving Amount (Manual)
        </span>
        <div className="relative h-11 bg-slate-50 dark:bg-white/5 rounded-xl">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400 pointer-events-none select-none">$</span>
          <Input
            {...register("savingAmount")}
            type="number"
            step="0.01"
            disabled={!enabled}
            className="border-none bg-transparent shadow-none h-full pl-8 pr-4 text-sm font-bold text-slate-900 dark:text-white focus-visible:ring-0 disabled:opacity-40"
            placeholder="0"
          />
        </div>
      </div>
    </div>
  );
}
