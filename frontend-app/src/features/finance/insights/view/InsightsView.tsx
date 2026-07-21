import { InsightsContext } from "../hooks/useInsightsController";
import { NetWorthCard } from "../components/NetWorthCard";
import { SpendingMatrixCard } from "../components/SpendingMatrixCard";
import { CashflowVelocityCard } from "../components/CashflowVelocityCard";

export function InsightsView({
  isNetWorthLoading,
  isSpendingLoading,
  integerPart,
  decimalPart,
  totalSavings,
  spendableCash,
  categoryBreakdown,
  totalSpending,
  cashflow,
  velocityTab,
  setVelocityTab,
}: InsightsContext) {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="grid gap-8 md:grid-cols-2">
        <NetWorthCard
          isLoading={isNetWorthLoading}
          integerPart={integerPart}
          decimalPart={decimalPart}
          totalSavings={totalSavings}
          spendableCash={spendableCash}
        />

        <SpendingMatrixCard
          isLoading={isSpendingLoading}
          breakdown={categoryBreakdown}
          totalSpending={totalSpending}
        />
      </div>

      <CashflowVelocityCard
        isLoading={isSpendingLoading}
        data={cashflow}
        velocityTab={velocityTab}
        onVelocityTabChange={setVelocityTab}
      />
    </div>
  );
}
