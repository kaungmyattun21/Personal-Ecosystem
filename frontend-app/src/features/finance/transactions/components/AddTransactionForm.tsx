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
      <DialogContent className="max-w-md rounded-[40px] border border-brand-emerald/20 dark:border-brand-emerald/40 bg-white/80 dark:bg-brand-bg-dark/80 backdrop-blur-2xl shadow-lg p-0 overflow-hidden max-h-[90vh] flex flex-col">
        <DialogHeader className="p-10 pb-2 flex flex-row items-center justify-between">
          <DialogTitle className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
            {ctrl.isEditMode ? "Edit Transaction" : "Add Transaction"}
          </DialogTitle>
        </DialogHeader>
        <TransactionFormView {...ctrl} />
      </DialogContent>
    </Dialog>
  );
}
