"use client";

import React, { useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { useTransactions } from "@/features/finance/transactions/hooks/useTransactions";
import { useCategories } from "@/features/finance/shared/hooks/useCategories";
import {
  eachDayOfInterval,
  endOfMonth,
  format,
  isSameDay,
  startOfMonth,
} from "date-fns";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

export function FinanceInsights() {
  const { transactions } = useTransactions();
  const { categories } = useCategories();

  // Expense Distribution Data
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

  // Daily Activity Data (Current Month)
  const barData = useMemo(() => {
    if (!transactions.data) return [];

    const now = new Date();
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
  }, [transactions.data]);

  const COLORS = ["#0ab08b", "#f43f5e", "#0ea5e9", "#f59e0b", "#8b5cf6"];

  return (
    <div className="space-y-8">
      <div className="grid gap-8 md:grid-cols-2">
        {/* Expense Distribution */}
        <Card className="p-8 group">
          <div className="mb-6">
            <h3 className="text-base font-black italic uppercase tracking-tighter text-brand-teal dark:text-white">
              Spending Matrix
            </h3>
            <p className="text-[9px] font-bold uppercase tracking-widest text-brand-teal-light dark:text-zinc-500 mt-1">
              Top Categories This Cycle
            </p>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                      strokeWidth={0}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    borderRadius: "20px",
                    border: "none",
                    boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)",
                    fontSize: "10px",
                    fontWeight: "800",
                    textTransform: "uppercase",
                  }}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  iconType="circle"
                  formatter={(value) => (
                    <span className="text-[10px] font-black uppercase text-slate-500 dark:text-zinc-400">
                      {value}
                    </span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Daily Pulse */}
        <Card className="p-8 group">
          <div className="mb-6">
            <h3 className="text-base font-black italic uppercase tracking-tighter text-brand-teal dark:text-white">
              Financial Velocity
            </h3>
            <p className="text-[9px] font-bold uppercase tracking-widest text-brand-teal-light dark:text-zinc-500 mt-1">
              Daily Cashflow Velocity
            </p>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  strokeOpacity={0.05}
                />
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 9, fill: "#94a3b8", fontWeight: 700 }}
                />
                <YAxis hide />
                <Tooltip
                  cursor={{ fill: "transparent" }}
                  contentStyle={{
                    borderRadius: "20px",
                    border: "none",
                    boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)",
                    fontSize: "10px",
                    fontWeight: "800",
                  }}
                />
                <Bar
                  dataKey="income"
                  fill="#0ab08b"
                  radius={[4, 4, 0, 0]}
                  barSize={6}
                />
                <Bar
                  dataKey="expense"
                  fill="#f43f5e"
                  radius={[4, 4, 0, 0]}
                  barSize={6}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}
