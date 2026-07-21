"use client";

import { useBudgetTrackerController } from "../hooks/useBudgetTrackerController";
import { BudgetTrackerView } from "../view/BudgetTrackerView";

interface BudgetTrackerProps {
  compact?: boolean;
}

export function BudgetTracker({ compact }: BudgetTrackerProps) {
  const ctrl = useBudgetTrackerController();

  return <BudgetTrackerView {...ctrl} compact={compact} />;
}
