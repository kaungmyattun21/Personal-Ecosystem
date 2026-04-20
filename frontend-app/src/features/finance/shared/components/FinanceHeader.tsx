"use client";

import React from "react";
import { Wallet, ArrowUpRight, Plus, TrendingUp } from "lucide-react";
import { useDispatch } from "react-redux";
import {
  setAddTransactionModalOpen,
  setAddBudgetModalOpen,
} from "@/lib/store/features/finance/finance-slice";
import { useAccounts } from "@/features/finance/shared/hooks/useAccounts";
import { useSavingGoals } from "@/features/finance/goals/hooks/useSavingGoals";
import { Card } from "@/components/ui/card";

export function FinanceHeader() {
  const dispatch = useDispatch();
  const { accounts } = useAccounts();
  const { savingGoals } = useSavingGoals();

  const actualBalance =
    accounts.data?.reduce((acc, curr) => acc + parseFloat(curr.balance), 0) ||
    0;

  const saving =
    savingGoals.data?.reduce(
      (acc, curr) => acc + parseFloat(curr.currentAmount),
      0,
    ) || 0;

  const totalWealth = actualBalance;
  const spendable = Math.max(0, actualBalance - saving);

  return (
    <div className="flex flex-col lg:flex-row items-start justify-between gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl lg:text-5xl font-black tracking-tighter text-brand-teal dark:text-white uppercase italic leading-none">
          Financial <span className="text-brand-emerald">Pulse</span>
        </h1>
        <p className="text-[10px] lg:text-[11px] font-black uppercase tracking-[0.3em] text-brand-teal/70 dark:text-zinc-400 max-w-md leading-relaxed">
          Orchestrate your wealth through granular tracking and high-velocity
          budgeting logic.
        </p>

        <div className="flex flex-wrap items-center gap-2 mt-6">
          <button
            onClick={() => dispatch(setAddTransactionModalOpen(true))}
            className="group flex items-center gap-3 bg-brand-teal text-white px-6 py-3 rounded-2xl text-[11px] font-black uppercase tracking-wider shadow-xl shadow-brand-teal/20 hover:scale-105 active:scale-95 transition-all"
          >
            <Plus size={16} strokeWidth={3} />
            Add Transaction
          </button>
          <button
            onClick={() => dispatch(setAddBudgetModalOpen(true))}
            className="flex items-center gap-3 bg-white dark:bg-white/5 border border-black/[0.05] dark:border-white/10 px-6 py-3 rounded-2xl text-[11px] font-black uppercase tracking-wider hover:bg-slate-50 dark:hover:bg-white/10 active:scale-95 transition-all"
          >
            <TrendingUp
              size={16}
              className="text-brand-emerald"
              strokeWidth={2.5}
            />
            New Budget
          </button>
        </div>
      </div>

      {/* Premium Balance Card - Dashboard Style */}
      <Card className="w-full lg:w-[480px] p-8 min-h-[220px] flex flex-col justify-between overflow-hidden group">
        {/* <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-bl-[100px] -z-10 pointer-events-none" /> */}

        <div className="relative z-10 flex flex-col h-full justify-between gap-8">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.25em] text-brand-teal/60 dark:text-zinc-400 mb-1">
                Net Liquid Wealth
              </p>
              <div className="flex items-baseline gap-1.5">
                <span className="text-[32px] font-black tracking-tighter text-brand-teal dark:text-white leading-none">
                  $
                  {actualBalance.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
                <span className="text-[10px] font-black text-brand-teal/50 dark:text-zinc-500 uppercase">
                  USD
                </span>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <div className="h-12 w-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                <Wallet className="text-primary h-6 w-6" strokeWidth={2} />
              </div>
              <div className="flex items-center gap-1.5 rounded-full bg-emerald-100 dark:bg-emerald-900/40 px-3 py-1 border border-emerald-200 dark:border-emerald-800">
                <div className="h-1.5 w-1.5 rounded-full bg-brand-emerald animate-pulse" />
                <span className="text-[8px] font-bold text-brand-emerald uppercase tracking-tighter">
                  Live
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 border-t border-black/[0.03] dark:border-white/[0.05] pt-6">
            <div className="flex flex-col gap-1">
              <span className="text-[9px] font-black uppercase tracking-widest text-brand-teal/60 dark:text-zinc-400">
                Total Saving
              </span>
              <span className="text-xl font-bold tracking-tight text-brand-emerald">
                $
                {saving.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[9px] font-black uppercase tracking-widest text-brand-teal/60 dark:text-zinc-400">
                Spendable
              </span>
              <span className="text-xl font-bold tracking-tight text-foreground/90">
                $
                {spendable.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                })}
              </span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
