import { useMemo } from "react";
import { useSession } from "next-auth/react";
import {
  startOfMonth,
  endOfMonth,
  subMonths,
  isWithinInterval,
  parseISO,
  startOfWeek,
  eachDayOfInterval,
  isSameDay,
  format,
} from "date-fns";
import { useAccounts } from "@/features/finance/shared/hooks/useAccounts";
import { useTransactions } from "@/features/finance/transactions/hooks/useTransactions";
import { Transaction } from "@/types/finance";

export function useDashboardController() {
  const { data: session } = useSession();
  const { accounts } = useAccounts();
  const { transactions } = useTransactions();

  const isLoading = accounts.isLoading || transactions.isLoading;
  const userName = session?.user?.name?.split(" ")[0] ?? "there";

  // Wealth calculations
  const totalBalance = useMemo(
    () =>
      accounts.data?.reduce((acc, a) => acc + parseFloat(a.balance), 0) ?? 0,
    [accounts.data],
  );

  const integerPart = Math.floor(Math.abs(totalBalance));
  const decimalPart = (Math.abs(totalBalance) % 1).toFixed(2).substring(2);
  const isNegative = totalBalance < 0;

  // Month-over-month calculations
  const stats = useMemo(() => {
    if (!transactions.data)
      return {
        currentMonthIncome: 0,
        lastMonthIncome: 0,
        netGain: 0,
        thisMonthExpense: 0,
      };
    const now = new Date();
    const thisStart = startOfMonth(now);
    const thisEnd = endOfMonth(now);
    const lastStart = startOfMonth(subMonths(now, 1));
    const lastEnd = endOfMonth(subMonths(now, 1));

    let currentMonthIncome = 0;
    let lastMonthIncome = 0;
    let thisMonthExpense = 0;

    for (const tx of transactions.data) {
      const d = parseISO(tx.date);
      const amount = parseFloat(tx.amount);
      if (tx.type === "INCOME") {
        if (isWithinInterval(d, { start: thisStart, end: thisEnd }))
          currentMonthIncome += amount;
        if (isWithinInterval(d, { start: lastStart, end: lastEnd }))
          lastMonthIncome += amount;
      } else if (tx.type === "EXPENSE") {
        if (isWithinInterval(d, { start: thisStart, end: thisEnd }))
          thisMonthExpense += Math.abs(amount);
      }
    }

    return {
      currentMonthIncome,
      lastMonthIncome,
      netGain: currentMonthIncome - lastMonthIncome,
      thisMonthExpense,
    };
  }, [transactions.data]);

  // Chart data
  const getChartData = (range: "weekly" | "monthly") => {
    if (!transactions.data) return [];
    const now = new Date();

    if (range === "weekly") {
      const days = eachDayOfInterval({
        start: startOfWeek(now, { weekStartsOn: 1 }),
        end: now,
      });
      return days.map((day) => {
        const dayTxs = transactions.data!.filter((tx: Transaction) =>
          isSameDay(parseISO(tx.date), day),
        );
        const income = dayTxs
          .filter((tx: Transaction) => tx.type === "INCOME")
          .reduce((s: number, tx: Transaction) => s + parseFloat(tx.amount), 0);
        const expense = dayTxs
          .filter((tx: Transaction) => tx.type === "EXPENSE")
          .reduce(
            (s: number, tx: Transaction) => s + Math.abs(parseFloat(tx.amount)),
            0,
          );
        return { name: format(day, "EEE"), income, expense };
      });
    } else {
      const weeks = [];
      for (let w = 3; w >= 0; w--) {
        const start = startOfWeek(now, { weekStartsOn: 1 });
        const wStart = new Date(start);
        wStart.setDate(wStart.getDate() - w * 7);
        const wEnd = new Date(wStart);
        wEnd.setDate(wEnd.getDate() + 6);

        const wTxs = transactions.data!.filter((tx: Transaction) => {
          const d = parseISO(tx.date);
          return isWithinInterval(d, { start: wStart, end: wEnd });
        });

        const income = wTxs
          .filter((tx: Transaction) => tx.type === "INCOME")
          .reduce((s: number, tx: Transaction) => s + parseFloat(tx.amount), 0);
        const expense = wTxs
          .filter((tx: Transaction) => tx.type === "EXPENSE")
          .reduce(
            (s: number, tx: Transaction) => s + Math.abs(parseFloat(tx.amount)),
            0,
          );
        weeks.push({ name: `Wk ${4 - w}`, income, expense });
      }
      return weeks;
    }
  };

  const recentTransactions = useMemo(() => {
    if (!transactions.data) return [];
    return [...transactions.data]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 6);
  }, [transactions.data]);

  return {
    userName,
    isLoading,
    totalBalance,
    integerPart,
    decimalPart,
    isNegative,
    ...stats,
    getChartData,
    recentTransactions,
    accounts: accounts.data || [],
  };
}
