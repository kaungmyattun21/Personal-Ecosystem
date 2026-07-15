"use client";

import { useState } from "react";
import { useShoppingListController } from "../hooks/useShoppingListController";
import { useKitchenOverviewController } from "@/features/kitchen/shared/hooks/useKitchenOverviewController";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Loader2,
  Calendar,
  CheckCircle,
  Circle,
  ShoppingCart,
  TrendingDown,
  Sparkles,
  Percent,
  Clock,
  ArrowRight,
  ChevronRight,
  Edit2,
  Trash2,
  Truck
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import { ShoppingList } from "@/types/kitchen";

export function ShoppingListView() {
  const {
    lists,
    isLoading,
    handleDelete,
    handleEdit,
    handleCreate,
    handleView,
  } = useShoppingListController();

  const { stats } = useKitchenOverviewController();

  // Pick the most recent active list to display details for
  const activeList = lists.find(l => l.status === "ACTIVE") || lists[0];

  // Local state for checking items dynamically for maximum UI snappiness
  const [completedItems, setCompletedItems] = useState<Record<string, boolean>>({
    "item-spinach": false,
    "item-avocados": false,
    "item-greek-yogurt": true,
    "item-olive-oil": false,
    "item-almond-milk": true,
  });

  const toggleItem = (itemId: string) => {
    setCompletedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-brand-teal" />
      </div>
    );
  }

  // Define some high-fidelity mock list items partitioned by category to render the checklist in Image 2
  const mockCategories = [
    {
      name: "Produce",
      items: [
        { id: "item-spinach", name: "Organic Baby Spinach", details: "250g • Local Farm", price: "$4.50" },
        { id: "item-avocados", name: "Avocados (Hass)", details: "3 units • Ripe", price: "$6.00" }
      ]
    },
    {
      name: "Dairy & Eggs",
      items: [
        { id: "item-greek-yogurt", name: "Organic Greek Yogurt", details: "32oz • Plain Non-Fat", price: "$5.80" },
        { id: "item-almond-milk", name: "Unsweetened Almond Milk", details: "1/2 Gal • Vanilla", price: "$3.50" }
      ]
    },
    {
      name: "Pantry",
      items: [
        { id: "item-olive-oil", name: "Extra Virgin Olive Oil", details: "500ml • Cold Pressed", price: "$14.99" }
      ]
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Top 3 Metrics Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        
        {/* Total Estimated Cost */}
        <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.02)] bg-white dark:bg-zinc-900 rounded-[32px] overflow-hidden">
          <CardContent className="p-6 flex flex-col justify-between h-full min-h-[140px]">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                Total Estimated Cost
              </span>
              <span className="flex items-center text-[9px] font-black text-brand-emerald bg-brand-emerald/10 px-2 py-0.5 rounded-md">
                <TrendingDown size={10} className="mr-0.5" />
                -12% lower
              </span>
            </div>
            <div className="mt-4">
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black tracking-tighter text-slate-900 dark:text-white">
                  ${stats.totalEstimatedCost}
                </span>
                <span className="text-xs font-bold text-slate-400">
                  from active lists
                </span>
              </div>
              <p className="text-[9px] font-medium text-slate-450 mt-2">
                Calculated in real-time
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Inventory Gap */}
        <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.02)] bg-white dark:bg-zinc-900 rounded-[32px] overflow-hidden">
          <CardContent className="p-6 flex flex-col justify-between h-full min-h-[140px]">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                Inventory Gap
              </span>
              <div className="h-7 w-7 rounded-lg bg-orange-500/10 flex items-center justify-center">
                <Percent size={14} className="text-orange-500" />
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black tracking-tighter text-slate-900 dark:text-white">
                  82%
                </span>
                <span className="text-xs font-bold text-slate-400">
                  optimized
                </span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 dark:bg-white/10 rounded-full mt-3 overflow-hidden">
                <div className="h-full bg-orange-500 rounded-full" style={{ width: "82%" }} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Time to Shop */}
        <Card className="border-none shadow-xl bg-brand-emerald text-slate-900 rounded-[32px] overflow-hidden">
          <CardContent className="p-6 flex flex-col justify-between h-full min-h-[140px]">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900/60">
                Time to Shop
              </span>
              <div className="h-7 w-7 rounded-lg bg-slate-900/10 flex items-center justify-center">
                <Clock size={14} className="text-slate-900" />
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black tracking-tighter">
                  22 min
                </span>
                <span className="text-[9px] font-black uppercase tracking-wider bg-slate-900 text-white px-2 py-0.5 rounded-md">
                  Route
                </span>
              </div>
              <p className="text-[9px] font-bold text-slate-900/80 mt-2">
                Aisle-optimized route ready
              </p>
            </div>
          </CardContent>
        </Card>

      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column (Checklist and Available Lists) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Active Checklist Box */}
          {activeList ? (
            <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.02)] bg-white dark:bg-zinc-900 rounded-[40px] p-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-100 dark:border-white/5">
                <div>
                  <span className="text-[9px] font-black text-brand-teal uppercase tracking-widest">
                    Live List
                  </span>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight mt-1">
                    {activeList.name}
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => handleEdit(activeList)}
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 rounded-xl text-slate-400 hover:text-brand-teal"
                  >
                    <Edit2 size={16} />
                  </Button>
                  <Button
                    onClick={() => handleDelete(activeList.id)}
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 rounded-xl text-red-400 hover:text-red-500"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>

              {/* Checklist Categories */}
              <div className="space-y-6">
                {mockCategories.map((cat, idx) => (
                  <div key={idx} className="space-y-3">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      {cat.name}
                    </h4>
                    
                    <div className="space-y-2">
                      {cat.items.map((item) => {
                        const isDone = completedItems[item.id];
                        return (
                          <div 
                            key={item.id} 
                            onClick={() => toggleItem(item.id)}
                            className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-white/5 hover:bg-slate-100/50 dark:hover:bg-white/10 transition-colors cursor-pointer"
                          >
                            <div className="flex items-center gap-3.5">
                              {isDone ? (
                                <CheckCircle size={20} className="text-brand-emerald" strokeWidth={2.5} />
                              ) : (
                                <Circle size={20} className="text-slate-300 dark:text-zinc-650" strokeWidth={2.5} />
                              )}
                              <div>
                                <p className={`text-sm font-bold tracking-tight transition-all ${
                                  isDone ? "text-slate-400 line-through" : "text-slate-800 dark:text-zinc-200"
                                }`}>
                                  {item.name}
                                </p>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mt-0.5">
                                  {item.details}
                                </p>
                              </div>
                            </div>
                            <span className={`text-xs font-black uppercase ${isDone ? "text-slate-400" : "text-slate-900 dark:text-white"}`}>
                              {item.price}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          ) : (
            <div className="text-center py-20 border-2 border-dashed rounded-[40px] bg-slate-50/50 dark:bg-white/5 border-slate-200 dark:border-white/10">
              <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">No active lists found.</p>
              <Button variant="link" className="mt-2 text-brand-teal font-black uppercase tracking-wider text-xs" onClick={handleCreate}>
                Create List
              </Button>
            </div>
          )}

          {/* Other Shopping Lists */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">
                My Shopping Registers
              </h3>
              <Button 
                onClick={handleCreate} 
                className="h-12 px-6 rounded-2xl bg-brand-teal text-white font-black uppercase tracking-widest shadow-xl shadow-brand-teal/20 hover:scale-[1.02] active:scale-[0.98] transition-all gap-2"
              >
                <Plus size={16} strokeWidth={3} />
                Create List
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {lists.map((list) => {
                const total = list.items?.length || 0;
                const completed = list.items?.filter(item => item.isCompleted).length || 0;
                const progressPct = total > 0 ? (completed / total) * 100 : 0;

                return (
                  <Card 
                    key={list.id} 
                    onClick={() => handleView(list.id)}
                    className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.02)] bg-white dark:bg-zinc-900 rounded-[32px] overflow-hidden p-6 hover:scale-[1.01] transition-all cursor-pointer group"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-base font-black text-slate-950 dark:text-white uppercase tracking-tight leading-snug group-hover:text-brand-teal transition-colors">
                          {list.name}
                        </h4>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                          {format(new Date(list.createdAt), "MMM d, yyyy")}
                        </p>
                      </div>
                      <span className="text-sm font-black text-brand-emerald bg-brand-emerald/10 px-2 py-0.5 rounded-md">
                        ${list.estimatedCost}
                      </span>
                    </div>

                    <div className="mt-6 space-y-2">
                      <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                        <span>Items progress</span>
                        <span>{completed} / {total}</span>
                      </div>
                      <div className="w-full h-1 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-brand-teal" style={{ width: `${progressPct || 40}%` }} />
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>

        </div>

        {/* Right Column (Inventory Insight & Deliveries) */}
        <div className="space-y-8">
          
          {/* Inventory Insight Card */}
          <Card className="border-none shadow-xl bg-slate-900 dark:bg-zinc-950 text-white rounded-[40px] overflow-hidden p-8 flex flex-col justify-between min-h-[220px]">
            <div className="space-y-4">
              <span className="text-[10px] font-black uppercase tracking-[0.25em] text-brand-teal">
                Inventory Insight
              </span>
              <p className="text-sm font-bold leading-relaxed text-zinc-300">
                You have 12 items expiring within the next 48 hours. These were prioritized in your meal plan generation.
              </p>
            </div>
            <button className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-brand-teal hover:text-brand-teal/80 transition-colors mt-6">
              View Expiry Dashboard
              <ArrowRight size={12} strokeWidth={2.5} />
            </button>
          </Card>

          {/* Smart Savings Card */}
          <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.02)] bg-white dark:bg-zinc-900 rounded-[40px] p-8">
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-black text-slate-900 dark:text-white uppercase tracking-tight">
                  Smart Savings
                </h3>
                <p className="text-xs font-medium text-slate-400">
                  Automated cost optimization report
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/10 border border-emerald-100 dark:border-emerald-950/20 text-xs font-bold">
                  <div>
                    <span className="text-emerald-500 uppercase tracking-widest text-[9px] block">Bulk Discount Applied</span>
                    <span className="text-slate-800 dark:text-zinc-200 mt-1 block">Eggs & Grains</span>
                  </div>
                  <span className="text-emerald-500 font-black">-$2.40</span>
                </div>

                <div className="flex items-center justify-between p-4 rounded-2xl bg-brand-teal/5 dark:bg-brand-teal/10 border border-brand-teal/10 text-xs font-bold">
                  <div>
                    <span className="text-brand-teal uppercase tracking-widest text-[9px] block">Seasonal Swap</span>
                    <span className="text-slate-800 dark:text-zinc-200 mt-1 block">Strawberries → Apples</span>
                  </div>
                  <span className="text-brand-teal font-black">-$3.20</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Delivery Partner Card */}
          <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.02)] bg-white dark:bg-zinc-900 rounded-[40px] p-8">
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-black text-slate-900 dark:text-white uppercase tracking-tight">
                  Delivery Partner
                </h3>
                <p className="text-xs font-medium text-slate-400">
                  High-velocity food logistics pipeline
                </p>
              </div>

              <div className="flex items-center gap-4 bg-slate-50 dark:bg-white/5 p-4 rounded-2xl">
                <div className="h-10 w-10 rounded-xl bg-brand-teal/10 flex items-center justify-center">
                  <Truck className="text-brand-teal" size={18} />
                </div>
                <div>
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-950 dark:text-white">
                    FreshDirect Elite
                  </h4>
                  <p className="text-[9px] font-bold text-slate-400 uppercase mt-0.5">
                    Earliest Window: Today, 6PM
                  </p>
                </div>
              </div>

              <Button className="w-full h-12 rounded-2xl bg-slate-900 hover:bg-slate-950 text-white font-black uppercase tracking-widest text-[10px]">
                Confirm Delivery Slot
              </Button>
            </div>
          </Card>

        </div>

      </div>

    </div>
  );
}
