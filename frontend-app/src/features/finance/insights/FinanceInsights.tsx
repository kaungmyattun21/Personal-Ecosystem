"use client";

import { useInsightsController } from "./hooks/useInsightsController";
import { InsightsView } from "./view/InsightsView";

export function FinanceInsights() {
  const ctrl = useInsightsController();

  return <InsightsView {...ctrl} />;
}
