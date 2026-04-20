"use client";

import React from "react";
import { FormProvider } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogPortal,
  DialogOverlay,
} from "@/components/ui/dialog";
import { Target, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { useSavingGoalForm } from "../hooks/useSavingGoalForm";

/**
 * Main View for Saving Goal Form.
 *
 * Orchestrates modular form sections for creating or editing financial targets.
 */
export function SavingGoalFormView() {
  const { form, isOpen, isEditMode, isPending, onSubmit, onCancel } =
    useSavingGoalForm();

  const { register, handleSubmit } = form;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
      <DialogPortal>
        <DialogOverlay className="bg-black/40 backdrop-blur-sm" />
        <DialogContent className="sm:max-w-[480px] p-0 overflow-hidden border-none bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur-2xl shadow-2xl rounded-[32px] font-sans">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-emerald/5 via-transparent to-brand-teal/5 pointer-events-none" />

          <DialogHeader className="px-8 pt-8 pb-6 relative">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-brand-emerald/10 dark:bg-brand-emerald/20 flex items-center justify-center text-brand-emerald">
                <Target size={24} strokeWidth={2.5} />
              </div>
              <div>
                <DialogTitle className="text-2xl font-black italic tracking-tight text-slate-800 dark:text-white uppercase leading-none">
                  {isEditMode ? "Edit Goal" : "New Goal"}
                </DialogTitle>
                <DialogDescription className="text-slate-500 dark:text-slate-400 font-medium text-sm mt-1 leading-none">
                  {isEditMode
                    ? "Modify your saving target"
                    : "Set a new financial target"}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <FormProvider {...form}>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="px-8 pb-8 space-y-6 relative"
            >
              <FormField name="name" label="Goal Name">
                <Input
                  placeholder="e.g. New Car, Vacation"
                  className="h-12 bg-white dark:bg-white/5 border-none rounded-xl px-4 text-sm font-medium focus-visible:ring-2 focus-visible:ring-brand-emerald shadow-sm transition-all text-slate-900 dark:text-white"
                  {...register("name")}
                />
              </FormField>

              <div className="grid grid-cols-2 gap-4">
                <FormField name="targetAmount" label="Target Amount">
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    className="h-12 bg-white dark:bg-white/5 border-none rounded-xl px-4 text-sm font-medium focus-visible:ring-2 focus-visible:ring-brand-emerald shadow-sm transition-all text-slate-900 dark:text-white"
                    {...register("targetAmount")}
                  />
                </FormField>

                <FormField name="currentAmount" label="Initial Saved">
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    className="h-12 bg-white dark:bg-white/5 border-none rounded-xl px-4 text-sm font-medium focus-visible:ring-2 focus-visible:ring-brand-emerald shadow-sm transition-all text-slate-900 dark:text-white"
                    {...register("currentAmount")}
                  />
                </FormField>
              </div>

              <FormField name="targetDate" label="Target Date (Optional)">
                <Input
                  type="date"
                  className="h-12 bg-white dark:bg-white/5 border-none rounded-xl px-4 text-sm font-medium focus-visible:ring-2 focus-visible:ring-brand-emerald shadow-sm transition-all text-slate-900 dark:text-white"
                  {...register("targetDate")}
                />
              </FormField>

              <div className="pt-4 flex gap-3">
                <Button
                  type="submit"
                  disabled={isPending}
                  className="flex-1 h-12 rounded-xl bg-brand-emerald hover:bg-brand-emerald/90 text-white font-black uppercase italic tracking-widest shadow-lg shadow-brand-emerald/20 transition-all active:scale-95 disabled:opacity-50"
                >
                  {isPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  {isEditMode ? "Save Changes" : "Create Goal"}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={onCancel}
                  className="px-6 h-12 rounded-xl text-slate-500 dark:text-slate-400 font-bold uppercase italic tracking-widest hover:bg-slate-200 dark:hover:bg-white/10 transition-all"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </FormProvider>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
