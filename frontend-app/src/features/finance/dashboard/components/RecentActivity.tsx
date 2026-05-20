import React from "react";
import { format } from "date-fns";
import {
  ArrowUpRight,
  ArrowDownLeft,
  ArrowLeftRight,
  Filter,
  Activity,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Transaction } from "@/types/finance";

interface RecentActivityProps {
  isLoading: boolean;
  transactions: Transaction[];
}

function Skeleton({ className }: { className?: string }) {
  return (
    <div className={`animate-pulse rounded-2xl bg-white/20 dark:bg-white/5 ${className ?? ""}`} />
  );
}

export function RecentActivity({ isLoading, transactions }: RecentActivityProps) {
  return (
    <Card className="mt-4 p-0 overflow-hidden border-none bg-white dark:bg-zinc-900/50 shadow-[0_12px_32px_-4px_rgba(4,39,39,0.04)] rounded-[24px]">
      <div className="p-7 border-b border-zinc-100 dark:border-white/5 flex items-center justify-between">
        <h3 className="text-base font-extrabold font-display uppercase tracking-tighter text-[#042727] dark:text-white">
          Recent Transactions
        </h3>
        <Filter size={18} className="text-[#042727]/40" />
      </div>

      <div className="overflow-x-auto">
        {isLoading ? (
          <div className="divide-y divide-zinc-100 dark:divide-white/5">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center gap-5 px-8 py-4">
                <Skeleton className="h-10 w-10 rounded-2xl shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-3 w-40" />
                  <Skeleton className="h-2 w-24" />
                </div>
                <Skeleton className="h-4 w-20" />
              </div>
            ))}
          </div>
        ) : transactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="h-14 w-14 rounded-2xl bg-[#042727]/5 flex items-center justify-center mb-4">
              <Activity className="h-7 w-7 text-[#042727] opacity-20" />
            </div>
            <p className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-1">
              No transactions yet
            </p>
            <p className="text-[10px] text-slate-300 dark:text-white/20">
              Add your first transaction to see activity here
            </p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <tbody className="divide-y divide-zinc-100 dark:divide-white/5">
              {transactions.map((tx) => {
                const isIncome = tx.type === "INCOME";
                const isTransfer = tx.type === "TRANSFER";
                const iconColor = isIncome
                  ? "bg-[#006b54]/10 text-[#006b54]"
                  : isTransfer
                  ? "bg-[#d39a3e]/10 text-[#d39a3e]"
                  : "bg-[#76001b]/10 text-[#76001b]";
                const amountColor = isIncome
                  ? "text-[#006b54]"
                  : isTransfer
                  ? "text-[#d39a3e]"
                  : "text-[#042727] dark:text-white";
                const sign = isIncome ? "+" : isTransfer ? "" : "-";

                return (
                  <tr
                    key={tx.id}
                    className="hover:bg-black/[0.01] dark:hover:bg-white/[0.01] transition-colors group"
                  >
                    <td className="px-8 py-4">
                      <div className="flex items-center gap-5">
                        <div
                          className={`flex h-10 w-10 items-center justify-center rounded-2xl transition-transform group-hover:scale-105 ${iconColor}`}
                        >
                          {isIncome ? (
                            <ArrowUpRight size={18} />
                          ) : isTransfer ? (
                            <ArrowLeftRight size={18} />
                          ) : (
                            <ArrowDownLeft size={18} />
                          )}
                        </div>
                        <div>
                          <div className="text-[13px] font-black uppercase tracking-tighter text-[#042727] dark:text-white leading-none mb-1 font-display">
                            {tx.description || tx.category?.name || "Transaction"}
                          </div>
                          <div className="text-[8.5px] font-bold uppercase tracking-widest text-[#042727]/60 dark:text-zinc-550">
                            {tx.category?.name ?? tx.type} &bull; {format(new Date(tx.date), "dd MMM")}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-4 text-right">
                      <div className={`text-[15px] font-black tracking-tighter ${amountColor} font-mono`}>
                        {sign}${Math.abs(parseFloat(tx.amount)).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                        <span className="text-[8.5px] uppercase font-black ml-1 opacity-60">
                          {tx.account?.currency ?? "USD"}
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      <div className="p-6 bg-black/[0.01] dark:bg-white/[0.01] text-center border-t border-zinc-100 dark:border-white/5">
        <button className="text-[10px] font-black uppercase tracking-[0.2em] text-[#042727]/45 hover:text-[#006b54] transition-colors bg-transparent border-none cursor-pointer">
          View All Transactions
        </button>
      </div>
    </Card>
  );
}
