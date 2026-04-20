"use client";

import { Dialog } from "@/components/ui/dialog";
import { useBillForm } from "@/features/finance/bills/hooks/useBillForm";
import { BillFormView } from "@/features/finance/bills/view/BillFormView";

export function AddBillForm() {
  const ctrl = useBillForm();

  return (
    <Dialog open={ctrl.isOpen} onOpenChange={ctrl.onClose}>
      <BillFormView {...ctrl} />
    </Dialog>
  );
}
