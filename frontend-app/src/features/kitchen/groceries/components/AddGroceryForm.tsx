"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useGroceryForm } from "../hooks/useGroceryForm";
import { GroceryFormView } from "../view/GroceryFormView";

/**
 * AddGroceryForm Container
 *
 * Orchestrates the Grocery Form by connecting the Controller Hook
 * to the Pure View Component within a Dialog.
 */
export function AddGroceryForm() {
  const ctrl = useGroceryForm();

  return (
    <Dialog open={ctrl.isOpen} onOpenChange={ctrl.onClose}>
      <DialogContent className="max-w-lg rounded-[40px] border border-brand-teal/20 dark:border-brand-teal/40 bg-white/80 dark:bg-brand-bg-dark/80 backdrop-blur-2xl shadow-lg p-0 overflow-hidden max-h-[90vh] flex flex-col">
        <DialogHeader className="p-10 pb-2 flex flex-row items-center justify-between">
          <DialogTitle className="text-2xl font-black tracking-tight text-slate-900 dark:text-white uppercase italic">
            {ctrl.isEditMode ? "Edit Item" : "Add Item"}
          </DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto">
          <GroceryFormView {...ctrl} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
