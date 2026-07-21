import { ArrowUpRight, Landmark } from "lucide-react";
import { Card } from "@/components/ui/card";

interface NetWorthCardProps {
  isLoading: boolean;
  integerPart: string;
  decimalPart: string;
  totalSavings: number;
  spendableCash: number;
}

function AmountSkeleton({ className }: { className: string }) {
  return <div className={`rounded-xl bg-zinc-200/70 dark:bg-white/10 animate-pulse ${className}`} />;
}

function currency(amount: number) {
  return amount.toLocaleString(undefined, { maximumFractionDigits: 2 });
}

export function NetWorthCard({
  isLoading,
  integerPart,
  decimalPart,
  totalSavings,
  spendableCash,
}: NetWorthCardProps) {
  return (
    <Card className="p-8 relative overflow-hidden bg-white dark:bg-zinc-900/50 border-none shadow-[0_12px_32px_-4px_rgba(4,39,39,0.04)] rounded-[24px] flex flex-col justify-between min-h-[350px]">
      <Landmark className="absolute right-8 top-8 h-28 w-28 text-[#042727]/[0.02] dark:text-white/[0.01] pointer-events-none stroke-[0.5]" />

      <div className="space-y-6">
        <div>
          <span className="text-[10px] font-bold font-sans uppercase tracking-[0.2em] text-[#042727]/60 dark:text-zinc-500 block mb-2">
            Current Net Worth
          </span>
          {isLoading ? (
            <AmountSkeleton className="h-9 w-48" />
          ) : (
            <div className="flex items-baseline">
              <span className="text-4xl font-extrabold font-display tracking-tight text-[#042727] dark:text-white leading-none">
                ${integerPart}
              </span>
              <span className="text-2xl font-bold font-display text-[#042727]/60 dark:text-white/60 leading-none">
                .{decimalPart}
              </span>
            </div>
          )}
          <div className="flex items-center gap-1.5 mt-3">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#74f6ce]/30 text-[#10b981] dark:bg-emerald-950/30 dark:text-emerald-400">
              <ArrowUpRight size={10} strokeWidth={3} />
              +12.4%
            </span>
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
              vs last quarter
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 border-t border-zinc-100 dark:border-zinc-800 pt-6 mt-8">
        <div className="space-y-1">
          <span className="text-[9px] font-bold text-[#042727]/60 dark:text-zinc-500 uppercase tracking-widest block">
            Total Savings
          </span>
          {isLoading ? (
            <AmountSkeleton className="h-6 w-24" />
          ) : (
            <span className="text-lg font-black font-mono text-brand-emerald dark:text-emerald-400">
              ${currency(totalSavings)}
            </span>
          )}
          <div className="h-0.5 w-12 bg-brand-emerald mt-2" />
        </div>

        <div className="space-y-1">
          <span className="text-[9px] font-bold text-[#042727]/60 dark:text-zinc-500 uppercase tracking-widest block">
            Spendable Cash
          </span>
          {isLoading ? (
            <AmountSkeleton className="h-6 w-24" />
          ) : (
            <span className="text-lg font-black font-mono text-[#042727] dark:text-white">
              ${currency(spendableCash)}
            </span>
          )}
          <div className="h-0.5 w-12 bg-[#042727] dark:bg-white/40 mt-2" />
        </div>
      </div>
    </Card>
  );
}
