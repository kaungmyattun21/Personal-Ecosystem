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
    <Card className="flex flex-col p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-base font-black italic uppercase tracking-tighter text-brand-teal dark:text-white">
            Activity Pulse
          </h3>
          <p className="text-[9px] font-bold uppercase tracking-widest text-brand-teal-light dark:text-zinc-500 mt-1">
            Income vs Expense
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setChartRange("weekly")}
            className={`px-4 py-2 rounded-xl text-[11px] font-black uppercase italic transition-all ${
              chartRange === "weekly"
                ? "bg-brand-emerald text-white shadow-lg shadow-brand-emerald/20"
                : "bg-black/[0.02] dark:bg-white/[0.04] text-brand-teal/40 hover:bg-black/[0.05]"
            }`}
          >
            Weekly
          </button>
          <button
            onClick={() => setChartRange("monthly")}
            className={`px-4 py-2 rounded-xl text-[11px] font-black uppercase transition-all ${
              chartRange === "monthly"
                ? "bg-brand-emerald text-white shadow-lg shadow-brand-emerald/20"
                : "bg-black/[0.02] dark:bg-white/[0.04] text-brand-teal/40 hover:bg-black/[0.05]"
            }`}
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
                  <stop offset="5%" stopColor="#0ab08b" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#0ab08b" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="6 6" vertical={false} strokeOpacity={0.05} />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: "#7c959a", fontWeight: 800 }}
                dy={15}
              />
              <YAxis hide />
              <Tooltip
                cursor={{
                  stroke: "#0ab08b",
                  strokeWidth: 1,
                  strokeDasharray: "4 4",
                }}
                contentStyle={{
                  borderRadius: "24px",
                  border: "1px solid rgba(0,0,0,0.03)",
                  boxShadow: "0 25px 50px -12px rgb(0 0 0 / 0.15)",
                  fontSize: "11px",
                  fontWeight: "800",
                  padding: "16px",
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
                stroke="#0ab08b"
                strokeWidth={4}
                fillOpacity={1}
                fill="url(#colorIncome)"
              />
              <Area
                type="monotone"
                dataKey="expense"
                name="Expense"
                stroke="#f43f5e"
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
