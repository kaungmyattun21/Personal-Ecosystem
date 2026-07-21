"use client";

import { useMemo, useState } from "react";
import { useTransactions } from "@/features/finance/transactions/hooks/useTransactions";
import { useAccounts } from "@/features/finance/shared/hooks/useAccounts";
import { useSavingGoals } from "@/features/finance/goals/hooks/useSavingGoals";
import {
  buildCashflowSeries,
  buildCategoryBreakdown,
  calculateSpendableCash,
  CashflowPoint,
  CategorySlice,
  splitCurrency,
  sumAccountBalances,
  sumGoalContributions,
  sumSlices,
  VelocityTab,
} from "../deriveInsights";

export interface InsightsContext {
  isNetWorthLoading: boolean;
  isSpendingLoading: boolean;
  netWorth: number;
  integerPart: string;
  decimalPart: string;
  totalSavings: number;
  spendableCash: number;
  categoryBreakdown: CategorySlice[];
  totalSpending: number;
  cashflow: CashflowPoint[];
  velocityTab: VelocityTab;
  setVelocityTab: (tab: VelocityTab) => void;
}

export function useInsightsController(): InsightsContext {
  const { transactions } = useTransactions();
  const { accounts } = useAccounts();
  const { savingGoals } = useSavingGoals();

  const [velocityTab, setVelocityTab] = useState<VelocityTab>("daily");

  const isNetWorthLoading = accounts.isPending || savingGoals.isPending;
  const isSpendingLoading = transactions.isPending;

  const netWorth = useMemo(
    () => sumAccountBalances(accounts.data ?? []),
    [accounts.data],
  );

  const totalSavings = useMemo(
    () => sumGoalContributions(savingGoals.data ?? []),
    [savingGoals.data],
  );

  const spendableCash = useMemo(
    () => calculateSpendableCash(netWorth, totalSavings),
    [netWorth, totalSavings],
  );

  const { integerPart, decimalPart } = useMemo(
    () => splitCurrency(netWorth),
    [netWorth],
  );

  const categoryBreakdown = useMemo(
    () => buildCategoryBreakdown(transactions.data ?? []),
    [transactions.data],
  );

  const totalSpending = useMemo(
    () => sumSlices(categoryBreakdown),
    [categoryBreakdown],
  );

  const cashflow = useMemo(
    () => buildCashflowSeries(transactions.data ?? [], velocityTab),
    [transactions.data, velocityTab],
  );

  return {
    isNetWorthLoading,
    isSpendingLoading,
    netWorth,
    integerPart,
    decimalPart,
    totalSavings,
    spendableCash,
    categoryBreakdown,
    totalSpending,
    cashflow,
    velocityTab,
    setVelocityTab,
  };
}
