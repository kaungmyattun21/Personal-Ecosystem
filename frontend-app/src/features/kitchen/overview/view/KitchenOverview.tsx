"use client";

import { useKitchenOverviewController } from "@/features/kitchen/shared/hooks/useKitchenOverviewController";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Package,
  AlertTriangle,
  ShoppingCart,
  Utensils,
  Loader2,
  Calendar,
  Sparkles,
  TrendingUp,
  User,
  Plus,
  ArrowRight,
  Flame,
  Dna,
  Candy,
  Gauge
} from "lucide-react";
import { format } from "date-fns";

export function KitchenOverview() {
  const { stats, groceries, isLoading } = useKitchenOverviewController();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-brand-teal" />
      </div>
    );
  }

  // Filter dynamic pantry items from real database
  const actionRequiredItems = groceries.filter(
    (item) => item.status === "LOW_STOCK" || (item.expiryDate && new Date(item.expiryDate) < new Date(Date.now() + 48 * 60 * 60 * 1000))
  ).slice(0, 3);

  const healthyReserveItems = groceries.filter(
    (item) => item.status === "AVAILABLE"
  ).slice(0, 3);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* 4 Premium Metric Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        
        {/* Calorie Target */}
        <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.02)] bg-white dark:bg-zinc-900 rounded-[32px] overflow-hidden">
          <CardContent className="p-6 flex flex-col justify-between h-full min-h-[140px]">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                Daily Calorie Target
              </span>
              <div className="h-8 w-8 rounded-xl bg-orange-500/10 flex items-center justify-center">
                <Flame size={16} className="text-orange-500" />
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black tracking-tighter text-slate-900 dark:text-white">
                  1,840
                </span>
                <span className="text-sm font-bold text-slate-400 dark:text-zinc-500">
                  / 2,200 kcal
                </span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 dark:bg-white/10 rounded-full mt-3 overflow-hidden">
                <div className="h-full bg-orange-500 rounded-full" style={{ width: "83.6%" }} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Protein Intake */}
        <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.02)] bg-white dark:bg-zinc-900 rounded-[32px] overflow-hidden">
          <CardContent className="p-6 flex flex-col justify-between h-full min-h-[140px]">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                Protein Intake
              </span>
              <div className="h-8 w-8 rounded-xl bg-brand-emerald/10 flex items-center justify-center">
                <Dna size={16} className="text-brand-emerald" />
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black tracking-tighter text-slate-900 dark:text-white">
                  92g
                </span>
                <span className="text-xs font-black text-brand-emerald bg-brand-emerald/10 px-2 py-0.5 rounded-md uppercase tracking-wide">
                  Optimal
                </span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 dark:bg-white/10 rounded-full mt-3 overflow-hidden">
                <div className="h-full bg-brand-emerald rounded-full" style={{ width: "75%" }} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sugar Consumption */}
        <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.02)] bg-white dark:bg-zinc-900 rounded-[32px] overflow-hidden">
          <CardContent className="p-6 flex flex-col justify-between h-full min-h-[140px]">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                Sugar Consumption
              </span>
              <div className="h-8 w-8 rounded-xl bg-amber-500/10 flex items-center justify-center">
                <Candy size={16} className="text-amber-500" />
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black tracking-tighter text-slate-900 dark:text-white">
                  24g
                </span>
                <span className="text-xs font-black text-amber-600 bg-amber-500/10 px-2 py-0.5 rounded-md uppercase tracking-wide">
                  Low
                </span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 dark:bg-white/10 rounded-full mt-3 overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: "48%" }} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Grocery Velocity */}
        <Card className="border-none shadow-xl bg-brand-teal text-white rounded-[32px] overflow-hidden">
          <CardContent className="p-6 flex flex-col justify-between h-full min-h-[140px]">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/70">
                Grocery Velocity
              </span>
              <div className="h-8 w-8 rounded-xl bg-white/15 flex items-center justify-center">
                <Gauge size={16} className="text-white" />
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black tracking-tighter">
                  0.84
                </span>
                <span className="text-[10px] font-black uppercase tracking-wider text-brand-emerald bg-white px-2 py-0.5 rounded-md">
                  Score
                </span>
              </div>
              <p className="text-[9px] font-medium text-white/80 mt-2">
                Top 5% efficiency this week
              </p>
            </div>
          </CardContent>
        </Card>

      </div>

      {/* Main Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column (2/3 width on desktop) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Grocery Velocity Ratio Chart */}
          <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.02)] bg-white dark:bg-zinc-900 rounded-[40px] overflow-hidden p-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">
                  Grocery Velocity Ratio
                </h3>
                <p className="text-xs font-medium text-slate-400">
                  Comparing consumption efficiency vs waste over the last 30 days.
                </p>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1.5 font-bold">
                  <div className="h-3 w-3 rounded bg-brand-teal" />
                  <span className="text-slate-600 dark:text-zinc-400">Consumption</span>
                </div>
                <div className="flex items-center gap-1.5 font-bold">
                  <div className="h-3 w-3 rounded bg-rose-200 dark:bg-rose-900" />
                  <span className="text-slate-600 dark:text-zinc-400">Waste</span>
                </div>
              </div>
            </div>

            {/* vertical bars SVG/HTML chart */}
            <div className="flex items-end justify-between h-56 pt-6 px-4">
              {[
                { day: "MON", consumed: 80, waste: 20 },
                { day: "TUE", consumed: 90, waste: 10 },
                { day: "WED", consumed: 70, waste: 30 },
                { day: "THU", consumed: 85, waste: 15 },
                { day: "FRI", consumed: 75, waste: 25 },
                { day: "SAT", consumed: 60, waste: 40 },
                { day: "SUN", consumed: 82, waste: 18 }
              ].map((item, idx) => (
                <div key={idx} className="flex flex-col items-center gap-3 w-12 sm:w-16">
                  <div className="w-6 sm:w-8 h-40 bg-slate-50 dark:bg-white/5 rounded-full overflow-hidden flex flex-col justify-end">
                    <div 
                      className="bg-rose-200 dark:bg-rose-900 w-full rounded-t-lg" 
                      style={{ height: `${item.waste}%` }} 
                    />
                    <div 
                      className="bg-brand-teal w-full" 
                      style={{ height: `${item.consumed}%` }} 
                    />
                  </div>
                  <span className="text-[10px] font-black text-slate-450 dark:text-zinc-500">
                    {item.day}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          {/* Meal Curator */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">
                  Meal Curator
                </h3>
                <p className="text-xs font-medium text-slate-400">
                  Recommended selections optimized to reduce inventory expiration risk.
                </p>
              </div>
              <span className="text-xs font-black uppercase tracking-widest text-brand-teal hover:underline cursor-pointer flex items-center gap-1.5">
                Full Schedule
                <ArrowRight size={14} />
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              {/* Recipe 1 */}
              <div className="group relative overflow-hidden rounded-[36px] bg-white dark:bg-zinc-900 shadow-sm transition-all hover:shadow-xl hover:scale-[1.02] cursor-pointer">
                {/* Visual Banner Placeholder */}
                <div className="h-44 w-full bg-gradient-to-tr from-brand-teal/20 via-brand-emerald/10 to-transparent flex items-center justify-center border-b border-slate-100 dark:border-white/5 relative">
                  <Utensils size={36} className="text-brand-teal/40" />
                  <div className="absolute top-4 left-4 rounded-full bg-white/90 dark:bg-zinc-900/90 px-3 py-1 text-[9px] font-black uppercase tracking-widest text-slate-800 dark:text-white shadow-sm">
                    DINNER • TODAY
                  </div>
                </div>
                <div className="p-6">
                  <h4 className="text-base font-black text-slate-900 dark:text-white uppercase tracking-tight line-clamp-1">
                    Poached Salmon with Asparagus
                  </h4>
                  <div className="flex items-center gap-4 mt-3 text-xs font-medium text-slate-400">
                    <span>25m prep</span>
                    <span>•</span>
                    <span>420 kcal</span>
                    <span>•</span>
                    <span>2 Servings</span>
                  </div>
                </div>
              </div>

              {/* Recipe 2 */}
              <div className="group relative overflow-hidden rounded-[36px] bg-white dark:bg-zinc-900 shadow-sm transition-all hover:shadow-xl hover:scale-[1.02] cursor-pointer">
                {/* Visual Banner Placeholder */}
                <div className="h-44 w-full bg-gradient-to-tr from-brand-emerald/20 via-amber-200/10 to-transparent flex items-center justify-center border-b border-slate-100 dark:border-white/5 relative">
                  <Sparkles size={36} className="text-brand-emerald/40" />
                  <div className="absolute top-4 left-4 rounded-full bg-white/90 dark:bg-zinc-900/90 px-3 py-1 text-[9px] font-black uppercase tracking-widest text-slate-800 dark:text-white shadow-sm">
                    LUNCH • TOMORROW
                  </div>
                </div>
                <div className="p-6">
                  <h4 className="text-base font-black text-slate-900 dark:text-white uppercase tracking-tight line-clamp-1">
                    Heirloom Tomato & Microgreen Bowl
                  </h4>
                  <div className="flex items-center gap-4 mt-3 text-xs font-medium text-slate-400">
                    <span>15m prep</span>
                    <span>•</span>
                    <span>310 kcal</span>
                    <span>•</span>
                    <span>1 Serving</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Right Column (1/3 width on desktop) */}
        <div className="space-y-8">
          
          {/* Insight Stream Card */}
          <Card className="border-none shadow-xl bg-slate-900 dark:bg-zinc-950 text-white rounded-[40px] overflow-hidden p-8 flex flex-col justify-between min-h-[300px] relative">
            <div className="absolute top-0 right-0 p-8">
              <TrendingUp className="text-brand-emerald h-8 w-8" />
            </div>
            
            <div className="space-y-6">
              <span className="text-[10px] font-black uppercase tracking-[0.25em] text-brand-emerald">
                Insight Stream
              </span>
              <p className="text-lg font-bold leading-relaxed text-zinc-100">
                "Your waste-consumption ratio improved by 12% this week. Keep it up!"
              </p>
              <button className="flex items-center gap-2 bg-brand-emerald hover:bg-brand-emerald/90 text-slate-900 px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-brand-emerald/20 mt-4">
                <Plus size={14} strokeWidth={3} />
                New Meal Plan
              </button>
            </div>

            <div className="flex items-center gap-4 border-t border-white/10 pt-6 mt-8">
              <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center text-white">
                <User size={18} />
              </div>
              <div>
                <h5 className="text-xs font-black uppercase tracking-wider">
                  Alex Rivera
                </h5>
                <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">
                  Premium Curator
                </p>
              </div>
            </div>
          </Card>

          {/* Pantry Status Checklist */}
          <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.02)] bg-white dark:bg-zinc-900 rounded-[40px] overflow-hidden p-8">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">
                  Pantry Status
                </h3>
                <p className="text-xs font-medium text-slate-400">
                  Granular tracking from tracked ingredients
                </p>
              </div>

              {/* Action Required Section */}
              <div className="space-y-4">
                <h4 className="text-[10px] font-black text-rose-500 uppercase tracking-widest">
                  Action Required
                </h4>
                <div className="space-y-3">
                  {actionRequiredItems.length > 0 ? (
                    actionRequiredItems.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-4 rounded-2xl bg-rose-50/50 dark:bg-rose-900/10 border border-rose-100 dark:border-rose-950/20 text-sm">
                        <div>
                          <p className="font-bold text-slate-800 dark:text-zinc-200">{item.name}</p>
                          <p className="text-[10px] font-bold text-rose-500 uppercase mt-0.5">
                            {item.status === "LOW_STOCK" ? "Low Stock" : "Expiring"} • {item.quantity} {item.unit || "units"} left
                          </p>
                        </div>
                        <div className="h-6 w-6 rounded-lg bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center">
                          <AlertTriangle size={12} className="text-rose-600" />
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs font-bold text-slate-350 uppercase tracking-widest py-2">
                      No stock warnings
                    </p>
                  )}
                </div>
              </div>

              {/* Healthy Reserve Section */}
              <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-white/5">
                <h4 className="text-[10px] font-black text-brand-emerald uppercase tracking-widest">
                  Healthy Reserve
                </h4>
                <div className="space-y-3">
                  {healthyReserveItems.length > 0 ? (
                    healthyReserveItems.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-white/5 text-sm">
                        <div>
                          <p className="font-bold text-slate-700 dark:text-zinc-300">{item.name}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase mt-0.5">
                            Optimal • {item.quantity} {item.unit || "units"}
                          </p>
                        </div>
                        <div className="h-6 w-6 rounded-lg bg-brand-emerald/10 flex items-center justify-center">
                          <Package size={12} className="text-brand-emerald" />
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs font-bold text-slate-350 uppercase tracking-widest py-2">
                      Empty Pantry register
                    </p>
                  )}
                </div>
              </div>

            </div>
          </Card>

        </div>

      </div>

    </div>
  );
}
