"use client";

import React from "react";
import { Plus, TrendingUp } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";
import {
  setAddTransactionModalOpen,
  setAddBudgetModalOpen,
} from "@/lib/store/features/finance/finance-slice";

export function FinanceHeader() {
  const dispatch = useDispatch();
  const activeTab = useSelector((state: RootState) => state.finance.activeTab);

  const tabMeta = {
    overview:      { label: "Overview",  title: "Financial Pulse" },
    transactions:  { label: "Activity",  title: "Portfolio Activity" },
    budgets:       { label: "Budgets",   title: "Active Budgets" },
    bills:         { label: "Bills",     title: "Bill Scheduler" },
    goals:         { label: "Goals",     title: "Saving Goals" },
  }[activeTab || "overview"];

  return (
    <div className="flex items-center justify-between">
      {/* Title block */}
      <div className="flex flex-col gap-0.5">
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-emerald dark:text-brand-emerald">
          {tabMeta.label}
        </span>
        <h1 className="text-2xl font-extrabold tracking-tight text-on-surface dark:text-white leading-none">
          {tabMeta.title}
        </h1>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => dispatch(setAddBudgetModalOpen(true))}
          className="flex items-center gap-2 h-9 px-4 rounded-xl bg-brand-bg-light dark:bg-white/5 text-on-surface dark:text-zinc-200 text-xs font-bold hover:bg-surface-container-low dark:hover:bg-white/10 active:scale-[0.98] transition-all"
        >
          <TrendingUp size={14} className="text-brand-emerald" strokeWidth={2.5} />
          New Budget
        </button>

        <button
          onClick={() => dispatch(setAddTransactionModalOpen(true))}
          className="flex items-center gap-2 h-9 px-4 rounded-xl bg-brand-teal dark:bg-white dark:text-on-surface text-white text-xs font-bold hover:bg-brand-teal/90 dark:hover:bg-slate-100 active:scale-[0.98] transition-all shadow-sm"
        >
          <Plus size={14} strokeWidth={2.5} />
          Add Transaction
        </button>
      </div>
    </div>
  );
}
