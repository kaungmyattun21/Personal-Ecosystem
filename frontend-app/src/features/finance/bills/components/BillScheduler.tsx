"use client";

import { useBillSchedulerController } from "../hooks/useBillSchedulerController";
import { BillSchedulerView } from "../view/BillSchedulerView";

interface BillSchedulerProps {
  limit?: number;
}

export function BillScheduler({ limit }: BillSchedulerProps) {
  const ctrl = useBillSchedulerController(limit);

  return <BillSchedulerView {...ctrl} limit={limit} />;
}
