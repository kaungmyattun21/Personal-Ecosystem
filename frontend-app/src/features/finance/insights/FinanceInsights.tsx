"use client";

import React, { useMemo, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { useTransactions } from "@/features/finance/transactions/hooks/useTransactions";
import { useCategories } from "@/features/finance/shared/hooks/useCategories";
import { useAccounts } from "@/features/finance/shared/hooks/useAccounts";
import { useSavingGoals } from "@/features/finance/goals/hooks/useSavingGoals";
import {
  eachDayOfInterval,
  endOfMonth,
  format,
  isSameDay,
  startOfMonth,
  startOfWeek,
  endOfWeek,
  subWeeks,
  subMonths,
  isWithinInterval,
} from "date-fns";
import { Card } from "@/components/ui/card";
import { Utensils, Car, Receipt, ShoppingCart, TrendingUp, Wallet, Landmark, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

// Helper to resolve category icons for the custom list legend
function CategoryIcon({ name, size = 16 }: { name: string; size?: number }) {
  const lowercaseName = name.toLowerCase();
  if (lowercaseName.includes("food") || lowercaseName.includes("dining") || lowercaseName.includes("restaurant")) {
    return <Utensils size={size} />;
  }
  if (lowercaseName.includes("transport") || lowercaseName.includes("car") || lowercaseName.includes("travel")) {
    return <Car size={size} />;
  }
  if (lowercaseName.includes("bill") || lowercaseName.includes("utility") || lowercaseName.includes("invoice")) {
    return <Receipt size={size} />;
  }
  if (lowercaseName.includes("shop") || lowercaseName.includes("grocery") || lowercaseName.includes("clothing")) {
    return <ShoppingCart size={size} />;
  }
  if (lowercaseName.includes("saving") || lowercaseName.includes("invest") || lowercaseName.includes("goal")) {
    return <TrendingUp size={size} />;
  }
  return <Wallet size={size} />;
}

export function FinanceInsights() {
  const { transactions } = useTransactions();
  const { categories } = useCategories();
  const { accounts } = useAccounts();
  const { savingGoals } = useSavingGoals();

  const [velocityTab, setVelocityTab] = useState<"daily" | "weekly" | "monthly">("daily");

  // Calculations for Net Worth Card
  const actualBalance = useMemo(() => {
    return accounts.data?.reduce((acc, curr) => acc + parseFloat(curr.balance), 0) || 0;
  }, [accounts.data]);

  const totalSavings = useMemo(() => {
    return savingGoals.data?.reduce((acc, curr) => acc + parseFloat(curr.currentAmount), 0) || 0;
  }, [savingGoals.data]);

  const spendableCash = useMemo(() => {
    return Math.max(0, actualBalance - totalSavings);
  }, [actualBalance, totalSavings]);

  const { integerPart, decimalPart } = useMemo(() => {
    const formatted = actualBalance.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    const parts = formatted.split(".");
    return { integerPart: parts[0], decimalPart: parts[1] };
  }, [actualBalance]);

  // Expense Distribution Data (Real data filtered to expenses, sorted & sliced to top 5)
  const pieData = useMemo(() => {
    if (!transactions.data || !categories.data) return [];

    const expenseTxs = transactions.data.filter((t) => t.type === "EXPENSE");
    const categoryTotals: Record<string, number> = {};

    expenseTxs.forEach((tx) => {
      const catName = tx.category?.name || "Uncategorized";
      categoryTotals[catName] =
        (categoryTotals[catName] || 0) + Math.abs(parseFloat(tx.amount));
    });

    return Object.entries(categoryTotals)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  }, [transactions.data, categories.data]);

  const totalSpending = useMemo(() => {
    return pieData.reduce((sum, item) => sum + item.value, 0);
  }, [pieData]);

  // Daily, Weekly, and Monthly Cashflow Velocity calculations
  const barData = useMemo(() => {
    if (!transactions.data) return [];

    const now = new Date();

    if (velocityTab === "daily") {
      // Daily: Last 30 days of the current month
      const start = startOfMonth(now);
      const end = endOfMonth(now);
      const days = eachDayOfInterval({ start, end });

      return days.map((day) => {
        const dayTxs = transactions.data!.filter((tx) =>
          isSameDay(new Date(tx.date), day),
        );

        const income = dayTxs
          .filter((tx) => tx.type === "INCOME")
          .reduce((sum, tx) => sum + parseFloat(tx.amount), 0);

        const expense = dayTxs
          .filter((tx) => tx.type === "EXPENSE")
          .reduce((sum, tx) => sum + Math.abs(parseFloat(tx.amount)), 0);

        return {
          date: format(day, "dd"),
          income,
          expense,
        };
      });
    } else if (velocityTab === "weekly") {
      // Weekly: Last 6 weeks of transactions
      const weeks = Array.from({ length: 6 }).map((_, i) => {
        const date = subWeeks(now, 5 - i);
        return {
          start: startOfWeek(date),
          end: endOfWeek(date),
          label: `Wk ${format(date, "I")}`,
        };
      });

      return weeks.map((wk) => {
        const wkTxs = transactions.data!.filter((tx) => {
          const txDate = new Date(tx.date);
          return isWithinInterval(txDate, { start: wk.start, end: wk.end });
        });

        const income = wkTxs
          .filter((tx) => tx.type === "INCOME")
          .reduce((sum, tx) => sum + parseFloat(tx.amount), 0);

        const expense = wkTxs
          .filter((tx) => tx.type === "EXPENSE")
          .reduce((sum, tx) => sum + Math.abs(parseFloat(tx.amount)), 0);

        return {
          date: wk.label,
          income,
          expense,
        };
      });
    } else {
      // Monthly: Last 6 months of transactions
      const months = Array.from({ length: 6 }).map((_, i) => {
        const date = subMonths(now, 5 - i);
        return {
          start: startOfMonth(date),
          end: endOfMonth(date),
          label: format(date, "MMM"),
        };
      });

      return months.map((mo) => {
        const moTxs = transactions.data!.filter((tx) => {
          const txDate = new Date(tx.date);
          return isWithinInterval(txDate, { start: mo.start, end: mo.end });
        });

        const income = moTxs
          .filter((tx) => tx.type === "INCOME")
          .reduce((sum, tx) => sum + parseFloat(tx.amount), 0);

        const expense = moTxs
          .filter((tx) => tx.type === "EXPENSE")
          .reduce((sum, tx) => sum + Math.abs(parseFloat(tx.amount)), 0);

        return {
          date: mo.label,
          income,
          expense,
        };
      });
    }
  }, [transactions.data, velocityTab]);

  // Brand Palette: Tonal variations of emerald, teal, charcoal, amber, and purple
  const COLORS = ["#042727", "#006b54", "#76001b", "#d39a3e", "#5f3ea3"];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Top Section: Net Worth Card & Spending Matrix Card side-by-side */}
      <div className="grid gap-8 md:grid-cols-2">
        {/* Current Net Worth Card */}
        <Card className="p-8 relative overflow-hidden bg-white dark:bg-zinc-900/50 border-none shadow-[0_12px_32px_-4px_rgba(4,39,39,0.04)] rounded-[24px] flex flex-col justify-between min-h-[350px]">
          <Landmark className="absolute right-8 top-8 h-28 w-28 text-[#042727]/[0.02] dark:text-white/[0.01] pointer-events-none stroke-[0.5]" />
          
          <div className="space-y-6">
            <div>
              <span className="text-[10px] font-bold font-sans uppercase tracking-[0.2em] text-[#042727]/60 dark:text-zinc-500 block mb-2">
                Current Net Worth
              </span>
              <div className="flex items-baseline">
                <span className="text-4xl font-extrabold font-display tracking-tight text-[#042727] dark:text-white leading-none">
                  ${integerPart}
                </span>
                <span className="text-2xl font-bold font-display text-[#042727]/60 dark:text-white/60 leading-none">
                  .{decimalPart}
                </span>
              </div>
              <div className="flex items-center gap-1.5 mt-3">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#74f6ce]/30 text-[#006b54] dark:bg-emerald-950/30 dark:text-emerald-400">
                  <ArrowUpRight size={10} strokeWidth={3} />
                  +12.4%
                </span>
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                  vs last quarter
                </span>
              </div>
            </div>
          </div>

          {/* Lower breakdown metrics */}
          <div className="grid grid-cols-2 gap-6 border-t border-zinc-100 dark:border-zinc-800 pt-6 mt-8">
            <div className="space-y-1">
              <span className="text-[9px] font-bold text-[#042727]/60 dark:text-zinc-500 uppercase tracking-widest block">
                Total Savings
              </span>
              <span className="text-lg font-black font-mono text-[#006b54] dark:text-emerald-400">
                ${totalSavings.toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </span>
              <div className="h-[2px] w-12 bg-[#006b54] mt-2" />
            </div>

            <div className="space-y-1">
              <span className="text-[9px] font-bold text-[#042727]/60 dark:text-zinc-500 uppercase tracking-widest block">
                Spendable Cash
              </span>
              <span className="text-lg font-black font-mono text-[#042727] dark:text-white">
                ${spendableCash.toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </span>
              <div className="h-[2px] w-12 bg-[#042727] dark:bg-white/40 mt-2" />
            </div>
          </div>
        </Card>

        {/* Spending Matrix Card */}
        <Card className="p-8 bg-white dark:bg-zinc-900/50 border-none shadow-[0_12px_32px_-4px_rgba(4,39,39,0.04)] rounded-[24px] flex flex-col justify-between min-h-[350px]">
          <div>
            <h3 className="text-base font-extrabold font-display uppercase tracking-tighter text-[#042727] dark:text-white">
              Spending Matrix
            </h3>
            <p className="text-[9px] font-bold uppercase tracking-widest text-[#042727]/60 dark:text-zinc-500 mt-1">
              Top Categories This Cycle
            </p>
          </div>

          <div className="h-[140px] w-full relative flex items-center justify-center my-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData.length ? pieData : [{ name: "No Spending", value: 1 }]}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={58}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.length ? (
                    pieData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                        strokeWidth={0}
                      />
                    ))
                  ) : (
                    <Cell fill="#f2f4f5" strokeWidth={0} />
                  )}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-[8px] font-bold text-zinc-400 uppercase tracking-widest leading-none">
                Total Spent
              </span>
              <span className="text-lg font-extrabold font-mono text-[#042727] dark:text-white tracking-tighter mt-0.5">
                ${totalSpending.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </span>
            </div>
          </div>

          {/* List legend showing name and amount */}
          <div className="space-y-3 pt-3 border-t border-zinc-100 dark:border-zinc-800">
            {pieData.slice(0, 3).map((item, index) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div
                    className="p-1.5 rounded-xl text-[#042727] dark:text-white"
                    style={{
                      backgroundColor: `${COLORS[index % COLORS.length]}12`,
                    }}
                  >
                    <CategoryIcon name={item.name} size={12} />
                  </div>
                  <span className="text-[11px] font-bold text-[#042727] dark:text-zinc-300">
                    {item.name}
                  </span>
                </div>
                <span className="text-[11px] font-black font-mono text-[#042727] dark:text-white">
                  ${item.value.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              </div>
            ))}
            {!pieData.length && (
              <div className="text-center text-[11px] text-zinc-400 dark:text-zinc-650 py-2 italic">
                No transactions recorded this month
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Bottom Section: Daily Pulse / Financial Velocity Card full width */}
      <Card className="p-8 bg-white dark:bg-zinc-900/50 border-none shadow-[0_12px_32px_-4px_rgba(4,39,39,0.04)] rounded-[24px]">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h3 className="text-base font-extrabold font-display uppercase tracking-tighter text-[#042727] dark:text-white">
              Financial Velocity
            </h3>
            <p className="text-[9px] font-bold uppercase tracking-widest text-[#042727]/60 dark:text-zinc-500 mt-1">
              {velocityTab === "daily" && "Daily Cashflow Performance"}
              {velocityTab === "weekly" && "Weekly Cashflow Velocity (Last 6 Weeks)"}
              {velocityTab === "monthly" && "Monthly Cashflow Velocity (Last 6 Months)"}
            </p>
          </div>

          {/* Toggle Chips */}
          <div className="flex bg-[#f2f4f5] dark:bg-white/5 p-1 rounded-full text-[9px] font-bold uppercase tracking-wider text-zinc-550">
            <button
              type="button"
              onClick={() => setVelocityTab("daily")}
              className={cn(
                "px-3.5 py-1.5 rounded-full transition-all cursor-pointer",
                velocityTab === "daily"
                  ? "bg-white dark:bg-zinc-800 text-[#042727] dark:text-white shadow-sm"
                  : "text-[#042727]/60 dark:text-zinc-400 hover:text-[#042727] dark:hover:text-white"
              )}
            >
              Daily
            </button>
            <button
              type="button"
              onClick={() => setVelocityTab("weekly")}
              className={cn(
                "px-3.5 py-1.5 rounded-full transition-all cursor-pointer",
                velocityTab === "weekly"
                  ? "bg-white dark:bg-zinc-800 text-[#042727] dark:text-white shadow-sm"
                  : "text-[#042727]/60 dark:text-zinc-400 hover:text-[#042727] dark:hover:text-white"
              )}
            >
              Weekly
            </button>
            <button
              type="button"
              onClick={() => setVelocityTab("monthly")}
              className={cn(
                "px-3.5 py-1.5 rounded-full transition-all cursor-pointer",
                velocityTab === "monthly"
                  ? "bg-white dark:bg-zinc-800 text-[#042727] dark:text-white shadow-sm"
                  : "text-[#042727]/60 dark:text-zinc-400 hover:text-[#042727] dark:hover:text-white"
              )}
            >
              Monthly
            </button>
          </div>
        </div>

        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} barGap={4}>
              <CartesianGrid strokeDasharray="6 6" vertical={false} strokeOpacity={0.03} />
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 9, fill: "#7c959a", fontWeight: 700 }}
              />
              <YAxis hide />
              <Tooltip
                cursor={{ fill: "transparent" }}
                contentStyle={{
                  borderRadius: "16px",
                  border: "none",
                  background: "rgba(4,39,39,0.95)",
                  color: "white",
                  fontSize: "10px",
                  fontWeight: "800",
                  padding: "10px 14px",
                }}
              />
              <Bar
                dataKey="income"
                name="Income"
                fill="#006b54"
                radius={[3, 3, 0, 0]}
                barSize={velocityTab === "daily" ? 6 : velocityTab === "weekly" ? 16 : 24}
              />
              <Bar
                dataKey="expense"
                name="Expense"
                fill="#76001b"
                radius={[3, 3, 0, 0]}
                barSize={velocityTab === "daily" ? 6 : velocityTab === "weekly" ? 16 : 24}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="flex justify-center gap-6 mt-6 pt-4 border-t border-zinc-150/15 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-[#006b54]" />
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Income</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-[#76001b]" />
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Expense</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
