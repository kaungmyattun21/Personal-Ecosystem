"use client";

import { ActionFAB } from "@/features/finance/shared/components/ActionFAB";
import { AddTransactionForm } from "@/features/finance/transactions/components/AddTransactionForm";
import {
  WealthSummary,
  ActivityPulse,
  AccountsSidebar,
  RecentActivity,
  useDashboardController,
} from "@/features/finance/dashboard";

export default function DashboardView() {
  const ctrl = useDashboardController();

  return (
    <div className="flex flex-col gap-6 pb-20 pt-2 lg:pb-10 max-w-7xl mx-auto w-full">
      {/* --- Main Dashboard Content --- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <WealthSummary
            isLoading={ctrl.isLoading}
            totalBalance={ctrl.totalBalance}
            integerPart={ctrl.integerPart}
            decimalPart={ctrl.decimalPart}
            isNegative={ctrl.isNegative}
            netGain={ctrl.netGain}
            currentMonthIncome={ctrl.currentMonthIncome}
            thisMonthExpense={ctrl.thisMonthExpense}
          />

          <ActivityPulse
            isLoading={ctrl.isLoading}
            getChartData={ctrl.getChartData}
          />
        </div>

        {/* Right Side */}
        <AccountsSidebar
          isLoading={ctrl.isLoading}
          accounts={ctrl.accounts}
          currentMonthIncome={ctrl.currentMonthIncome}
          thisMonthExpense={ctrl.thisMonthExpense}
          netGain={ctrl.netGain}
        />
      </div>

      {/* --- Recent Activity Feed --- */}
      <RecentActivity
        isLoading={ctrl.isLoading}
        transactions={ctrl.recentTransactions}
      />

      <ActionFAB />
      <AddTransactionForm />
    </div>
  );
}
