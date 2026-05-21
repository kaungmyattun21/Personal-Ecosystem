"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useMealPlanForm } from "../hooks/useMealPlanForm";
import { MealPlanFormView } from "../view/MealPlanFormView";

export function AddMealPlanForm() {
  const ctrl = useMealPlanForm();

  return (
    <Dialog open={ctrl.isOpen} onOpenChange={ctrl.onClose}>
      <DialogContent className="max-w-lg rounded-[40px] border border-brand-teal/20 dark:border-brand-teal/40 bg-white/80 dark:bg-brand-bg-dark/80 backdrop-blur-2xl shadow-lg p-0 overflow-hidden max-h-[90vh] flex flex-col">
        <DialogHeader className="p-10 pb-2 flex flex-row items-center justify-between">
          <DialogTitle className="text-2xl font-black tracking-tight text-slate-900 dark:text-white uppercase">
            {ctrl.isEditMode ? "Edit Plan" : "Create Plan"}
          </DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto">
          <MealPlanFormView {...ctrl} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
