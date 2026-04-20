"use client";

import { Dialog } from "@/components/ui/dialog";
import { useBudgetForm } from "@/features/finance/budgets/hooks/useBudgetForm";
import { BudgetFormView } from "@/features/finance/budgets/view/BudgetFormView";

export function AddBudgetForm() {
  const ctrl = useBudgetForm();

  return (
    <Dialog open={ctrl.isOpen} onOpenChange={ctrl.onClose}>
      <BudgetFormView {...ctrl} />
    </Dialog>
  );
}
