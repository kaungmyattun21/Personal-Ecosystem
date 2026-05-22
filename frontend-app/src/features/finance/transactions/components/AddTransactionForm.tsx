"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useTransactionForm } from "@/features/finance/transactions/hooks/useTransactionForm";
import { TransactionFormView } from "@/features/finance/transactions/view/TransactionFormView";

/**
 * AddTransactionForm Container
 *
 * Orchestrates the Transaction Form by connecting the Controller Hook
 * to the Pure View Component within a Dialog.
 */
export function AddTransactionForm() {
  const ctrl = useTransactionForm();

  return (
    <Dialog open={ctrl.isOpen} onOpenChange={ctrl.onClose}>
      <DialogContent className="max-w-260 rounded-[32px] border border-brand-emerald/20 dark:border-brand-emerald/40 bg-white dark:bg-brand-bg-dark shadow-2xl p-0 overflow-hidden max-h-[80vh] flex flex-col">
        <DialogHeader className="px-10 pt-9 pb-1">
          <DialogTitle className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
            {ctrl.isEditMode ? "Edit Transaction" : "Log Transaction"}
          </DialogTitle>
          <p className="text-sm text-slate-400 dark:text-slate-500 font-medium">
            Update your records with ease.
          </p>
        </DialogHeader>
        <TransactionFormView {...ctrl} />
      </DialogContent>
    </Dialog>
  );
}
