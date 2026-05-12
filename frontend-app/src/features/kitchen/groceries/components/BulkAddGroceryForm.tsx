"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useBulkGroceryForm } from "../hooks/useBulkGroceryForm";
import { BulkAddGroceryFormView } from "../view/BulkAddGroceryFormView";

export function BulkAddGroceryForm() {
  const {
    form,
    fields,
    addRow,
    removeRow,
    onSubmit,
    isOpen,
    onClose,
    isLoading,
  } = useBulkGroceryForm();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] lg:max-w-[1400px] rounded-[40px] border border-brand-teal/20 dark:border-brand-teal/40 bg-white/80 dark:bg-brand-bg-dark/80 backdrop-blur-2xl shadow-lg p-0 overflow-hidden max-h-[90vh] flex flex-col">
        <DialogHeader className="p-10 pb-2 flex flex-row items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-brand-teal/10 flex items-center justify-center">
              <div className="h-6 w-6 rounded-lg bg-brand-teal" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight italic">
                Batch Grocery Entry
              </DialogTitle>
              <p className="text-sm font-medium text-slate-500 dark:text-zinc-400">
                Add multiple items to your pantry at once
              </p>
            </div>
          </div>
        </DialogHeader>

        <BulkAddGroceryFormView
          form={form}
          fields={fields}
          addRow={addRow}
          removeRow={removeRow}
          onSubmit={onSubmit}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  );
}
