import React, { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ActivityPulseProps {
  isLoading: boolean;
  getChartData: (range: "weekly" | "monthly") => any[];
}

function Skeleton({ className }: { className?: string }) {
  return (
    <div className={`animate-pulse rounded-2xl bg-white/20 dark:bg-white/5 ${className ?? ""}`} />
  );
}

export function ActivityPulse({ isLoading, getChartData }: ActivityPulseProps) {
  const [chartRange, setChartRange] = useState<"weekly" | "monthly">("weekly");
  const chartData = getChartData(chartRange);

  return (
    <Card className="flex flex-col p-8 border-none bg-white dark:bg-zinc-900/50 shadow-[0_12px_32px_-4px_rgba(4,39,39,0.04)] rounded-[24px]">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h3 className="text-base font-extrabold font-display uppercase tracking-tighter text-[#042727] dark:text-white">
            Activity Pulse
          </h3>
          <p className="text-[9px] font-bold uppercase tracking-widest text-[#042727]/60 dark:text-zinc-500 mt-1">
            Income vs Expense Analysis
          </p>
        </div>

        {/* Toggle Chips */}
        <div className="flex bg-[#f2f4f5] dark:bg-white/5 p-1 rounded-full text-[9px] font-bold uppercase tracking-wider text-zinc-550">
          <button
            onClick={() => setChartRange("weekly")}
            className={cn(
              "px-3.5 py-1.5 rounded-full transition-all cursor-pointer font-bold",
              chartRange === "weekly"
                ? "bg-white dark:bg-zinc-800 text-[#042727] dark:text-white shadow-sm"
                : "text-[#042727]/60 dark:text-zinc-400 hover:text-[#042727] dark:hover:text-white"
            )}
          >
            Weekly
          </button>
          <button
            onClick={() => setChartRange("monthly")}
            className={cn(
              "px-3.5 py-1.5 rounded-full transition-all cursor-pointer font-bold",
              chartRange === "monthly"
                ? "bg-white dark:bg-zinc-800 text-[#042727] dark:text-white shadow-sm"
                : "text-[#042727]/60 dark:text-zinc-400 hover:text-[#042727] dark:hover:text-white"
            )}
          >
            Monthly
          </button>
        </div>
      </div>

      <div className="h-[420px] w-full">
        {isLoading ? (
          <Skeleton className="h-full w-full" />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#006b54" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#006b54" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#76001b" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#76001b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="6 6" vertical={false} strokeOpacity={0.03} />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 9, fill: "#7c959a", fontWeight: 700 }}
                dy={10}
              />
              <YAxis hide />
              <Tooltip
                cursor={{
                  stroke: "#006b54",
                  strokeWidth: 1,
                  strokeDasharray: "4 4",
                }}
                contentStyle={{
                  borderRadius: "16px",
                  border: "none",
                  background: "rgba(4,39,39,0.95)",
                  color: "white",
                  fontSize: "10px",
                  fontWeight: "800",
                  padding: "10px 14px",
                  textTransform: "uppercase",
                }}
                formatter={(value: any) =>
                  `$${Number(value ?? 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}`
                }
              />
              <Area
                type="monotone"
                dataKey="income"
                name="Income"
                stroke="#006b54"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorIncome)"
              />
              <Area
                type="monotone"
                dataKey="expense"
                name="Expense"
                stroke="#76001b"
                strokeWidth={2}
                strokeDasharray="5 5"
                fillOpacity={1}
                fill="url(#colorExpense)"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </Card>
  );
}
