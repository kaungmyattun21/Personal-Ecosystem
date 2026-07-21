import {
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isWithinInterval,
  startOfMonth,
  startOfWeek,
  subMonths,
  subWeeks,
} from "date-fns";
import { Account, SavingGoal, Transaction } from "@/types/finance";

export type VelocityTab = "daily" | "weekly" | "monthly";

export interface CategorySlice {
  name: string;
  value: number;
}

export interface CashflowPoint {
  date: string;
  income: number;
  expense: number;
}

export function sumAccountBalances(accounts: Account[]): number {
  return accounts.reduce((total, account) => total + parseFloat(account.balance), 0);
}

export function sumGoalContributions(goals: SavingGoal[]): number {
  return goals.reduce((total, goal) => total + parseFloat(goal.currentAmount), 0);
}

export function calculateSpendableCash(balance: number, savings: number): number {
  return Math.max(0, balance - savings);
}

export function splitCurrency(amount: number): {
  integerPart: string;
  decimalPart: string;
} {
  const [integerPart, decimalPart] = amount
    .toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
    .split(".");

  return { integerPart, decimalPart };
}

export function buildCategoryBreakdown(
  transactions: Transaction[],
  limit = 5,
): CategorySlice[] {
  const totalsByCategory: Record<string, number> = {};

  for (const transaction of transactions) {
    if (transaction.type !== "EXPENSE") continue;

    const name = transaction.category?.name || "Uncategorized";
    totalsByCategory[name] =
      (totalsByCategory[name] || 0) + Math.abs(parseFloat(transaction.amount));
  }

  return Object.entries(totalsByCategory)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, limit);
}

export function sumSlices(slices: CategorySlice[]): number {
  return slices.reduce((total, slice) => total + slice.value, 0);
}

function totalFor(transactions: Transaction[], type: Transaction["type"]): number {
  return transactions
    .filter((transaction) => transaction.type === type)
    .reduce((total, transaction) => total + Math.abs(parseFloat(transaction.amount)), 0);
}

function toPoint(
  label: string,
  transactions: Transaction[],
): CashflowPoint {
  return {
    date: label,
    income: totalFor(transactions, "INCOME"),
    expense: totalFor(transactions, "EXPENSE"),
  };
}

const WEEKS_SHOWN = 6;
const MONTHS_SHOWN = 6;

export function buildCashflowSeries(
  transactions: Transaction[],
  tab: VelocityTab,
  now: Date = new Date(),
): CashflowPoint[] {
  if (tab === "daily") {
    const days = eachDayOfInterval({
      start: startOfMonth(now),
      end: endOfMonth(now),
    });

    return days.map((day) =>
      toPoint(
        format(day, "dd"),
        transactions.filter((tx) => isSameDay(new Date(tx.date), day)),
      ),
    );
  }

  const isWeekly = tab === "weekly";
  const bucketCount = isWeekly ? WEEKS_SHOWN : MONTHS_SHOWN;

  const buckets = Array.from({ length: bucketCount }, (_, index) => {
    const offset = bucketCount - 1 - index;
    const date = isWeekly ? subWeeks(now, offset) : subMonths(now, offset);

    return {
      start: isWeekly ? startOfWeek(date) : startOfMonth(date),
      end: isWeekly ? endOfWeek(date) : endOfMonth(date),
      label: isWeekly ? `Wk ${format(date, "I")}` : format(date, "MMM"),
    };
  });

  return buckets.map((bucket) =>
    toPoint(
      bucket.label,
      transactions.filter((tx) =>
        isWithinInterval(new Date(tx.date), {
          start: bucket.start,
          end: bucket.end,
        }),
      ),
    ),
  );
}
