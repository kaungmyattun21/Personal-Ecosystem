"use client";

import React from "react";
import { Package, Utensils, Plus, ShoppingCart, Layers } from "lucide-react";
import { useDispatch } from "react-redux";
import {
  setAddGroceryModalOpen,
  setAddShoppingListModalOpen,
  setBulkAddGroceryModalOpen,
} from "@/lib/store/features/kitchen/kitchen-slice";
import { useKitchenOverviewController } from "@/features/kitchen/shared/hooks/useKitchenOverviewController";
import { Card } from "@/components/ui/card";

export function KitchenHeader() {
  const dispatch = useDispatch();
  const { stats } = useKitchenOverviewController();

  return (
    <div className="flex flex-col lg:flex-row items-start justify-between gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl lg:text-5xl font-black tracking-tighter text-brand-teal dark:text-white uppercase leading-none">
          Kitchen <span className="text-brand-emerald">Intelligence</span>
        </h1>
        <p className="text-[10px] lg:text-[11px] font-black uppercase tracking-[0.3em] text-brand-teal/75 dark:text-zinc-400 max-w-md leading-relaxed">
          WEALTH OF HEALTH
        </p>

        <div className="flex flex-wrap items-center gap-2 mt-6">
          <button
            onClick={() => dispatch(setAddGroceryModalOpen(true))}
            className="group flex items-center gap-3 bg-brand-teal text-white px-6 py-3 rounded-2xl text-[11px] font-black uppercase tracking-wider shadow-xl shadow-brand-teal/20 hover:scale-105 active:scale-95 transition-all"
          >
            <Plus size={16} strokeWidth={3} />
            Add Grocery
          </button>
          <button
            onClick={() => dispatch(setBulkAddGroceryModalOpen(true))}
            className="group flex items-center gap-3 bg-brand-teal/10 text-brand-teal px-6 py-3 rounded-2xl text-[11px] font-black uppercase tracking-wider hover:bg-brand-teal/20 active:scale-95 transition-all border border-brand-teal/20"
          >
            <Layers size={16} strokeWidth={2.5} />
            Batch Entry
          </button>
          <button
            onClick={() => dispatch(setAddShoppingListModalOpen(true))}
            className="flex items-center gap-3 bg-white dark:bg-white/5 border border-black/[0.05] dark:border-white/10 px-6 py-3 rounded-2xl text-[11px] font-black uppercase tracking-wider hover:bg-slate-50 dark:hover:bg-white/10 active:scale-95 transition-all"
          >
            <ShoppingCart
              size={16}
              className="text-brand-emerald"
              strokeWidth={2.5}
            />
            New List
          </button>
        </div>
      </div>

      <Card className="w-full lg:w-[480px] p-8 min-h-[220px] flex flex-col justify-between overflow-hidden group">
        <div className="relative z-10 flex flex-col h-full justify-between gap-8">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.25em] text-brand-teal/60 dark:text-zinc-400 mb-1">
                Inventory Status
              </p>
              <div className="flex items-baseline gap-1.5">
                <span className="text-[32px] font-black tracking-tighter text-brand-teal dark:text-white leading-none">
                  {stats.totalGroceries}
                </span>
                <span className="text-[10px] font-black text-brand-teal/50 dark:text-zinc-500 uppercase">
                  Items tracked
                </span>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <div className="h-12 w-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                <Package className="text-primary h-6 w-6" strokeWidth={2} />
              </div>
              <div className="flex items-center gap-1.5 rounded-full bg-emerald-100 dark:bg-emerald-900/40 px-3 py-1 border border-emerald-200 dark:border-emerald-800">
                <div className="h-1.5 w-1.5 rounded-full bg-brand-emerald animate-pulse" />
                <span className="text-[8px] font-bold text-brand-emerald uppercase tracking-tighter">
                  Synced
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 border-t border-black/[0.03] dark:border-white/[0.05] pt-6">
            <div className="flex flex-col gap-1">
              <span className="text-[9px] font-black uppercase tracking-widest text-brand-teal/60 dark:text-zinc-400">
                Upcoming Meals
              </span>
              <span className="text-xl font-bold tracking-tight text-brand-emerald">
                {stats.upcomingMeals}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[9px] font-black uppercase tracking-widest text-brand-teal/60 dark:text-zinc-400">
                Shopping Cost
              </span>
              <span className="text-xl font-bold tracking-tight text-foreground/90">
                ${stats.totalEstimatedCost}
              </span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
