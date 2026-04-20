import React from "react";
import { Wallet, TrendingUp, TrendingDown, Activity, Flame } from "lucide-react";
import { Card } from "@/components/ui/card";

interface WealthSummaryProps {
  isLoading: boolean;
  totalBalance: number;
  integerPart: number;
  decimalPart: string;
  isNegative: boolean;
  netGain: number;
  currentMonthIncome: number;
  thisMonthExpense: number;
}

function Skeleton({ className }: { className?: string }) {
  return (
    <div className={`animate-pulse rounded-2xl bg-white/20 dark:bg-white/5 ${className ?? ""}`} />
  );
}

export function WealthSummary({
  isLoading,
  integerPart,
  decimalPart,
  isNegative,
  netGain,
  currentMonthIncome,
  thisMonthExpense,
}: WealthSummaryProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Total Wealth Card */}
      <Card className="relative overflow-hidden p-10 flex flex-col justify-between group min-h-[260px] bg-brand-teal dark:bg-white/[0.05] border-none shadow-2xl shadow-brand-teal/20 dark:shadow-none transition-all hover:scale-[1.01]">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-emerald/20 via-transparent to-brand-teal/10 opacity-60 pointer-events-none" />
        <div className="relative z-10 flex flex-col h-full justify-between">
          <div>
            <span className="text-[8.5px] font-black uppercase tracking-[0.3em] text-white/70 mb-2 block">
              Total Wealth
            </span>
            {isLoading ? (
              <div className="mt-3 space-y-2">
                <Skeleton className="h-10 w-48 bg-white/10" />
              </div>
            ) : (
              <div className="flex items-baseline gap-1 mt-3 text-white">
                <span className="text-[42px] font-black tracking-tighter leading-none">
                  {isNegative ? "-" : ""}${integerPart.toLocaleString()}
                </span>
                <span className="text-lg font-bold opacity-80">.{decimalPart}</span>
              </div>
            )}
          </div>
          {isLoading ? (
            <div className="mt-10">
              <Skeleton className="h-10 w-40 bg-white/10" />
            </div>
          ) : (
            <div className="mt-10 flex items-center gap-2 rounded-2xl bg-white/10 px-6 py-3 w-fit backdrop-blur-md border border-white/10 shadow-inner group-hover:bg-white/15 transition-colors text-white">
              {netGain >= 0 ? (
                <TrendingUp size={16} className="text-brand-emerald-light" strokeWidth={3} />
              ) : (
                <TrendingDown size={16} className="text-orange-300" strokeWidth={3} />
              )}
              <span className="text-[11px] font-black tracking-wide">
                {netGain >= 0 ? "+" : ""}$
                {Math.abs(netGain).toLocaleString(undefined, { maximumFractionDigits: 2 })}{" "}
                <span className="text-white/70 font-bold ml-1 uppercase text-[9px]">
                  vs last month
                </span>
              </span>
            </div>
          )}
        </div>
        <Wallet className="absolute -right-8 -bottom-8 text-white/[0.08] w-56 h-56 pointer-events-none rotate-12" strokeWidth={0.5} />
      </Card>

      {/* This Month Summary Card */}
      <Card className="flex flex-col justify-between p-8 min-h-[260px] group transition-transform hover:-translate-y-1">
        <div className="flex items-start justify-between mb-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-emerald/10 text-brand-emerald border border-brand-emerald/5 shadow-inner">
            <Activity size={20} strokeWidth={2.5} />
          </div>
          <span className="text-[8px] font-black uppercase tracking-[0.25em] text-brand-teal/60 dark:text-white/60 mt-2">
            This Month
          </span>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-black/[0.08] dark:border-white/[0.08] pb-3">
            <div className="flex flex-col">
              <h3 className="text-sm font-black tracking-tight text-brand-teal dark:text-white uppercase italic leading-none mb-1">
                Income
              </h3>
              <p className="text-[9px] font-bold text-brand-teal/60 dark:text-zinc-400">
                Received this month
              </p>
            </div>
            {isLoading ? (
              <Skeleton className="h-6 w-20" />
            ) : (
              <span className="text-[15px] font-black text-brand-emerald tabular-nums">
                +${currentMonthIncome.toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </span>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <h3 className="text-[26px] font-black tracking-tighter text-brand-teal dark:text-white leading-none">
                {isLoading ? (
                  <Skeleton className="h-8 w-32" />
                ) : (
                  `$${thisMonthExpense.toLocaleString(undefined, { maximumFractionDigits: 2 })}`
                )}
              </h3>
              <p className="text-[7.5px] font-black uppercase tracking-[0.2em] text-orange-600 dark:text-orange-400 mt-2">
                Spent This Month
              </p>
            </div>
            <Flame size={28} className="text-orange-500 opacity-90" strokeWidth={2.5} />
          </div>
        </div>
      </Card>
    </div>
  );
}
