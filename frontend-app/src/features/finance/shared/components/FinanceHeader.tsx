"use client";

import React from "react";
import { Plus, TrendingUp, Search, Bell, Settings } from "lucide-react";
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
    overview: { label: "Overview", title: "Financial Pulse" },
    transactions: { label: "Activity", title: "Portfolio Activity" },
    budgets: { label: "Budgets", title: "Active Budgets" },
    bills: { label: "Bills", title: "Bill Scheduler" },
    goals: { label: "Goals", title: "Saving Goals" },
  }[activeTab || "overview"];

  return (
    <div className="w-full flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-2 border-none">
      {/* Editorial Title & Label */}
      <div className="flex flex-col gap-1.5">
        <span className="text-[10px] font-bold font-sans uppercase tracking-[0.25em] text-[#006b54] dark:text-[#74f6ce]">
          {tabMeta.label}
        </span>
        <h1 className="text-3xl lg:text-4xl font-extrabold font-display tracking-tight text-[#042727] dark:text-white leading-none">
          {tabMeta.title}
        </h1>
      </div>

      {/* Header Actions & Controls */}
      <div className="flex items-center flex-wrap gap-4 w-full md:w-auto justify-end">
        {/* Search Input Box */}
        <div className="relative hidden lg:block w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search portfolios, assets, or markets..."
            className="w-full bg-[#f2f4f5] dark:bg-white/5 border-none rounded-full py-2.5 pl-10 pr-4 text-xs text-[#191c1d] dark:text-white placeholder-zinc-450 focus:outline-none focus:ring-1 focus:ring-[#042727] transition-all"
          />
        </div>

        {/* Small Utility Icons */}
        <div className="hidden sm:flex items-center gap-3">
          <button className="p-2.5 rounded-full hover:bg-[#f2f4f5] dark:hover:bg-white/5 text-[#042727] dark:text-white transition-colors cursor-pointer relative">
            <Bell size={18} />
            <span className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-[#76001b]" />
          </button>
          <button className="p-2.5 rounded-full hover:bg-[#f2f4f5] dark:hover:bg-white/5 text-[#042727] dark:text-white transition-colors cursor-pointer">
            <Settings size={18} />
          </button>
        </div>

        {/* CTA Pills */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <button
            onClick={() => dispatch(setAddBudgetModalOpen(true))}
            className="flex items-center justify-center gap-2 bg-[#f2f4f5] dark:bg-white/5 text-[#191c1d] dark:text-zinc-200 px-5 py-2.5 rounded-full text-[11px] font-black uppercase tracking-widest hover:bg-zinc-200 dark:hover:bg-white/10 active:scale-[0.98] transition-all cursor-pointer"
          >
            <TrendingUp size={14} className="text-[#006b54]" strokeWidth={2.5} />
            <span>New Budget</span>
          </button>
          
          <button
            onClick={() => dispatch(setAddTransactionModalOpen(true))}
            className="flex items-center justify-center gap-2 bg-gradient-to-br from-[#042727] to-[#1d3d3d] hover:to-[#042727] text-white px-5 py-2.5 rounded-full text-[11px] font-black uppercase tracking-widest shadow-[0_8px_20px_rgba(4,39,39,0.15)] active:scale-[0.98] transition-all cursor-pointer"
          >
            <Plus size={14} strokeWidth={3} />
            <span>Add Transaction</span>
          </button>
        </div>
      </div>
    </div>
  );
}
