"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useShoppingListForm } from "../hooks/useShoppingListForm";
import { ShoppingListFormView } from "../view/ShoppingListFormView";

/**
 * AddShoppingListForm Container
 */
export function AddShoppingListForm() {
  const ctrl = useShoppingListForm();

  return (
    <Dialog open={ctrl.isOpen} onOpenChange={ctrl.onClose}>
      <DialogContent className="max-w-md rounded-[40px] border border-brand-teal/20 dark:border-brand-teal/40 bg-white/80 dark:bg-brand-bg-dark/80 backdrop-blur-2xl shadow-lg p-0 overflow-hidden max-h-[90vh] flex flex-col">
        <DialogHeader className="p-10 pb-2 flex flex-row items-center justify-between">
          <DialogTitle className="text-2xl font-black tracking-tight text-slate-900 dark:text-white uppercase italic">
            {ctrl.isEditMode ? "Edit List" : "Create List"}
          </DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto">
          <ShoppingListFormView {...ctrl} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
