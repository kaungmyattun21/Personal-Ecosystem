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
      <Card className="relative overflow-hidden p-10 flex flex-col justify-between group min-h-[260px] bg-gradient-to-br from-[#042727] to-[#1d3d3d] border-none shadow-[0_12px_32px_-4px_rgba(4,39,39,0.08)] dark:shadow-none transition-all hover:scale-[1.01] rounded-[24px]">
        <div className="absolute inset-0 bg-gradient-to-br from-[#10b981]/20 via-transparent to-[#042727]/10 opacity-60 pointer-events-none" />
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
                <span className="text-[42px] font-black tracking-tighter leading-none font-display">
                  {isNegative ? "-" : ""}${integerPart.toLocaleString()}
                </span>
                <span className="text-lg font-bold opacity-80 font-display">.{decimalPart}</span>
              </div>
            )}
          </div>
          {isLoading ? (
            <div className="mt-10">
              <Skeleton className="h-10 w-40 bg-white/10" />
            </div>
          ) : (
            <div className="mt-10 flex items-center gap-2 rounded-full bg-white/5 px-6 py-3 w-fit backdrop-blur-md border border-white/10 shadow-inner group-hover:bg-white/10 transition-colors text-white">
              {netGain >= 0 ? (
                <TrendingUp size={16} className="text-[#74f6ce]" strokeWidth={3} />
              ) : (
                <TrendingDown size={16} className="text-red-400" strokeWidth={3} />
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
        <Wallet className="absolute -right-8 -bottom-8 text-white/[0.04] w-56 h-56 pointer-events-none rotate-12" strokeWidth={0.5} />
      </Card>

      {/* This Month Summary Card */}
      <Card className="flex flex-col justify-between p-8 min-h-[260px] group border-none bg-white dark:bg-zinc-900/50 shadow-[0_12px_32px_-4px_rgba(4,39,39,0.04)] rounded-[24px] transition-transform hover:scale-[1.01]">
        <div className="flex items-start justify-between mb-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#10b981]/10 text-[#10b981] border border-[#10b981]/5 shadow-inner">
            <Activity size={20} strokeWidth={2.5} />
          </div>
          <span className="text-[8px] font-black uppercase tracking-[0.25em] text-[#042727]/60 dark:text-white/60 mt-2">
            This Month
          </span>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <h3 className="text-sm font-black tracking-tight text-[#042727] dark:text-white uppercase leading-none mb-1">
                Income
              </h3>
              <p className="text-[9px] font-bold text-[#042727]/60 dark:text-zinc-500">
                Received this month
              </p>
            </div>
            {isLoading ? (
              <Skeleton className="h-6 w-20" />
            ) : (
              <span className="text-[15px] font-black text-[#10b981] tabular-nums">
                +${currentMonthIncome.toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </span>
            )}
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="flex flex-col">
              <h3 className="text-[26px] font-black tracking-tighter text-[#042727] dark:text-white leading-none font-display">
                {isLoading ? (
                  <Skeleton className="h-8 w-32" />
                ) : (
                  `$${thisMonthExpense.toLocaleString(undefined, { maximumFractionDigits: 2 })}`
                )}
              </h3>
              <p className="text-[7.5px] font-black uppercase tracking-[0.2em] text-[#d39a3e] dark:text-[#d39a3e] mt-2">
                Spent This Month
              </p>
            </div>
            <Flame size={28} className="text-[#d39a3e] opacity-90" strokeWidth={2.5} />
          </div>
        </div>
      </Card>
    </div>
  );
}
