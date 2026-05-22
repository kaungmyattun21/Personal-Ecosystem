"use client";

import React, { useRef, useState } from "react";
import { FormProvider } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, ChevronUp, ChevronDown, CloudUpload } from "lucide-react";
import { FormField } from "@/components/ui/form-field";
import { TransactionFormContext } from "../hooks/useTransactionForm";
import { TransactionTypeToggle } from "../components/TransactionTypeToggle";
import { CategorySelector } from "../components/CategorySelector";
import { BudgetSelector } from "../components/BudgetSelector";
import { SavingGoalSelector } from "../components/SavingGoalSelector";
import { SavingContributionSection } from "../components/SavingContributionSection";
import { TagsInput } from "../components/TagsInput";

interface TransactionFormViewProps
  extends Omit<TransactionFormContext, "isOpen" | "onClose"> {}

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
  const { register, handleSubmit, setValue, watch } = form;
  const amount = watch("amount");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const stepAmount = (dir: 1 | -1) => {
    const current = parseFloat(String(amount)) || 0;
    const next = Math.max(0, parseFloat((current + dir).toFixed(2)));
    setValue("amount", next);
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) setReceiptFile(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setReceiptFile(file);
  };

  return (
    <FormProvider {...form}>
      <p className="sr-only">
        Enter details for your transaction to record income or expenses.
      </p>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col flex-1 overflow-hidden"
      >
        <div className="flex flex-1 overflow-hidden divide-x divide-slate-100 dark:divide-white/6">

          {/* ── Left column ── */}
          <div className="flex-1 px-9 py-6 space-y-5 overflow-y-auto custom-scrollbar">

            <TransactionTypeToggle />

            {/* Amount */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
                Transaction Amount
              </span>
              <div className="relative flex items-center border-b-2 border-slate-200 dark:border-white/10 pb-2.5 group focus-within:border-brand-emerald transition-colors">
                <span className="absolute left-0 text-3xl font-black text-slate-300 dark:text-slate-600 select-none pointer-events-none">$</span>
                <input
                  {...register("amount")}
                  placeholder="0.00"
                  className="flex-1 min-w-0 pl-9 bg-transparent outline-none border-none text-5xl font-black text-slate-900 dark:text-white placeholder:text-slate-200 dark:placeholder:text-slate-700"
                />
                <div className="flex flex-col gap-0.5 shrink-0 ml-2">
                  <button type="button" onClick={() => stepAmount(1)}
                    className="flex items-center justify-center w-6 h-5 rounded-t-md bg-slate-100 dark:bg-white/8 hover:bg-slate-200 dark:hover:bg-white/12 text-slate-500 transition-colors">
                    <ChevronUp className="h-3 w-3" strokeWidth={2.5} />
                  </button>
                  <button type="button" onClick={() => stepAmount(-1)}
                    className="flex items-center justify-center w-6 h-5 rounded-b-md bg-slate-100 dark:bg-white/8 hover:bg-slate-200 dark:hover:bg-white/12 text-slate-500 transition-colors">
                    <ChevronDown className="h-3 w-3" strokeWidth={2.5} />
                  </button>
                </div>
              </div>
            </div>

            {/* Date + Category — identical height/radius */}
            <div className="grid grid-cols-2 gap-3">
              <FormField name="date" label="Date">
                <div className="relative group">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-emerald transition-colors z-10">
                    <Calendar className="h-4 w-4" strokeWidth={2} />
                  </span>
                  <Input
                    type="date"
                    {...register("date")}
                    className="bg-slate-50 dark:bg-white/5 border-none rounded-2xl pl-10 text-sm font-medium text-slate-900 dark:text-white focus-visible:ring-1 focus-visible:ring-brand-emerald/30"
                  />
                </div>
              </FormField>

              <CategorySelector categories={categories} />
            </div>

            {/* Notes */}
            <FormField name="description" label="Notes">
              <textarea
                {...register("description")}
                rows={3}
                placeholder="What was this for?"
                className="w-full resize-none bg-slate-50 dark:bg-white/5 border-none rounded-2xl px-4 py-3 text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-brand-emerald/30 transition-colors"
              />
            </FormField>

            {/* Attach Receipt */}
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleFileDrop}
              className={`flex items-center gap-4 px-5 py-3.5 rounded-2xl border-2 border-dashed cursor-pointer transition-all select-none ${
                isDragging
                  ? "border-brand-emerald bg-brand-emerald/5"
                  : receiptFile
                  ? "border-brand-emerald/40 bg-brand-emerald/5 dark:bg-brand-emerald/10"
                  : "border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20"
              }`}
            >
              <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-slate-100 dark:bg-white/8 shrink-0">
                <CloudUpload className="h-4 w-4 text-slate-500 dark:text-slate-400" strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                  {receiptFile ? receiptFile.name : "Attach Receipt"}
                </p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                  {receiptFile ? `${(receiptFile.size / 1024).toFixed(1)} KB` : "PDF, JPG up to 5MB"}
                </p>
              </div>
              <input ref={fileInputRef} type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden" onChange={handleFileChange} />
            </div>

            {/* Budget only (expense-only selector renders itself null when not applicable) */}
            <BudgetSelector budgets={budgets} />
          </div>

          {/* ── Right column ── */}
          <div className="w-96 shrink-0 px-8 py-6 space-y-6 overflow-y-auto custom-scrollbar">
            <SavingGoalSelector savingGoals={savingGoals} />
            <TagsInput />
            <SavingContributionSection />
          </div>
        </div>

        {/* ── Footer ── */}
        <div className="px-9 py-4 border-t border-slate-100 dark:border-white/6 flex items-center justify-end gap-3 shrink-0">
          <Button
            type="button"
            variant="ghost"
            className="h-11 px-6 rounded-2xl font-bold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isPending}
            className="h-11 px-8 rounded-2xl bg-brand-teal dark:bg-white dark:text-slate-900 hover:bg-brand-teal/90 dark:hover:bg-slate-100 text-white font-black text-sm shadow-lg shadow-brand-teal/20 dark:shadow-none transition-all active:scale-[0.98]"
          >
            {isPending
              ? isEditMode ? "Saving..." : "Creating..."
              : isEditMode ? "Save Changes" : "Save Transaction"}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
