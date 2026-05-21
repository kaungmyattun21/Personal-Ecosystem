"use client";

import { useGroceriesController } from "../hooks/useGroceriesController";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Search,
  Loader2,
  AlertTriangle,
  Flame,
  ArrowDownRight,
  ArrowUpRight,
  TrendingUp,
  SlidersHorizontal,
  Download,
  Edit2,
  Trash2,
  Calendar,
  Sparkles,
  Package,
  Layers
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import { useDispatch } from "react-redux";
import { setBulkAddGroceryModalOpen } from "@/lib/store/features/kitchen/kitchen-slice";

export function GroceriesView() {
  const dispatch = useDispatch();
  const {
    items,
    isLoading,
    searchQuery,
    setSearchQuery,
    handleDelete,
    handleEdit,
    handleAdd,
  } = useGroceriesController();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-brand-teal" />
      </div>
    );
  }

  // Group items by category to calculate portfolio allocation
  const categorySummary = items.reduce(
    (acc, item) => {
      const cat = (item.category || "Pantry").toUpperCase();
      if (cat.includes("PRODUCE")) acc.produce += 1;
      else if (cat.includes("PROTEIN") || cat.includes("MEAT")) acc.proteins += 1;
      else if (cat.includes("DAIRY")) acc.dairy += 1;
      else acc.pantry += 1;
      return acc;
    },
    { produce: 0, proteins: 0, dairy: 0, pantry: 0 }
  );

  const totalItemsCount = items.length || 1;
  const weights = {
    produce: Math.round((categorySummary.produce / totalItemsCount) * 100),
    proteins: Math.round((categorySummary.proteins / totalItemsCount) * 100),
    dairy: Math.round((categorySummary.dairy / totalItemsCount) * 100),
    pantry: Math.round((categorySummary.pantry / totalItemsCount) * 100)
  };

  // Static/dynamic allocation display estimates layered on actual counts
  const assetCategories = [
    {
      name: "Produce",
      cost: `$${(categorySummary.produce * 12 + 45).toFixed(2)}`,
      weight: `${weights.produce || 25}%`,
      change: "+4.2%",
      isPositive: true,
      color: "bg-emerald-500",
      textColor: "text-emerald-500",
      status: "Live Stocks"
    },
    {
      name: "Proteins",
      cost: `$${(categorySummary.proteins * 28 + 95).toFixed(2)}`,
      weight: `${weights.proteins || 35}%`,
      change: "Stable",
      isPositive: null,
      color: "bg-blue-500",
      textColor: "text-blue-500",
      status: "Stable"
    },
    {
      name: "Dairy",
      cost: `$${(categorySummary.dairy * 15 + 32).toFixed(2)}`,
      weight: `${weights.dairy || 20}%`,
      change: "-1.5%",
      isPositive: false,
      color: "bg-rose-500",
      textColor: "text-rose-500",
      status: "Live Stocks"
    },
    {
      name: "Pantry",
      cost: `$${(categorySummary.pantry * 8 + 64).toFixed(2)}`,
      weight: `${weights.pantry || 20}%`,
      change: "Low Volatility",
      isPositive: null,
      color: "bg-amber-500",
      textColor: "text-amber-500",
      status: "Low Volatility"
    }
  ];

  const getFreshnessPct = (expiryDate?: string) => {
    if (!expiryDate) return 85; // Default safe level
    const diff = new Date(expiryDate).getTime() - new Date().getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    if (days <= 0) return 5;
    if (days >= 10) return 98;
    return Math.round((days / 10) * 100);
  };

  const getClassificationBadge = (cat?: string) => {
    const c = (cat || "pantry").toLowerCase();
    if (c.includes("produce")) return "bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-450 border border-emerald-200 dark:border-emerald-900/50";
    if (c.includes("protein") || c.includes("meat")) return "bg-blue-100 dark:bg-blue-950/40 text-blue-600 dark:text-blue-450 border border-blue-200 dark:border-blue-900/50";
    if (c.includes("dairy")) return "bg-rose-100 dark:bg-rose-950/40 text-rose-600 dark:text-rose-450 border border-rose-200 dark:border-rose-900/50";
    return "bg-amber-100 dark:bg-amber-950/40 text-amber-600 dark:text-amber-450 border border-amber-200 dark:border-amber-900/50";
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* 4 Category Allocation Cards & Intelligence Insights Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column (2/3 width for Categories) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">
              Asset Allocation by Category
            </h3>
            <div className="bg-slate-100/50 dark:bg-white/5 p-1 rounded-xl flex items-center border border-slate-200/50 dark:border-white/5">
              <span className="text-[9px] font-black uppercase tracking-widest px-3 py-1 bg-white dark:bg-zinc-800 rounded-lg shadow-sm">Live Stocks</span>
              <span className="text-[9px] font-black uppercase tracking-widest px-3 py-1 text-slate-400">Historical</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {assetCategories.map((cat, idx) => (
              <Card key={idx} className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.02)] bg-white dark:bg-zinc-900 rounded-[32px] overflow-hidden p-6 hover:scale-[1.01] transition-all">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                      {cat.name}
                    </span>
                    <h4 className="text-3xl font-black tracking-tighter text-slate-900 dark:text-white mt-1">
                      {cat.cost}
                    </h4>
                  </div>
                  <div className="flex flex-col items-end">
                    {cat.isPositive === true ? (
                      <span className="flex items-center text-[10px] font-black text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                        <ArrowUpRight size={10} className="mr-0.5" />
                        {cat.change}
                      </span>
                    ) : cat.isPositive === false ? (
                      <span className="flex items-center text-[10px] font-black text-rose-500 bg-rose-500/10 px-2 py-0.5 rounded-md">
                        <ArrowDownRight size={10} className="mr-0.5" />
                        {cat.change}
                      </span>
                    ) : (
                      <span className="text-[10px] font-black text-slate-400 bg-slate-100 dark:bg-white/5 px-2 py-0.5 rounded-md">
                        {cat.change}
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-500">Portfolio Weight: {cat.weight}</span>
                </div>
                <div className="w-full h-1 bg-slate-100 dark:bg-white/5 rounded-full mt-2.5 overflow-hidden">
                  <div className={`h-full ${cat.color}`} style={{ width: cat.weight }} />
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Right Column (Intelligence Insights) */}
        <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.02)] bg-white dark:bg-zinc-900 rounded-[40px] p-8">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">
                Intelligence Insights
              </h3>
              <p className="text-xs font-medium text-slate-400">
                Actionable metrics from grocery levels
              </p>
            </div>

            <div className="space-y-4">
              
              {/* Insight 1 */}
              <div className="space-y-2">
                <span className="flex items-center gap-1.5 text-[9px] font-black text-brand-teal uppercase tracking-widest">
                  <Sparkles size={12} />
                  Velocity Alert
                </span>
                <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed font-bold">
                  Your consumption of <strong className="text-slate-900 dark:text-white">Spinach</strong> and <strong className="text-slate-900 dark:text-white">Avocados</strong> has increased by 40% this week. Replenishment recommended by Tuesday.
                </p>
              </div>

              {/* Insight 2 */}
              <div className="space-y-2 pt-4 border-t border-slate-100 dark:border-white/5">
                <span className="flex items-center gap-1.5 text-[9px] font-black text-rose-500 uppercase tracking-widest">
                  <AlertTriangle size={12} />
                  Expiration Hedge
                </span>
                <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed font-bold">
                  Tracked items enter the critical expiration risk zone in less than 48 hours. Intelligence suggests "Lemon Garlic Meal Prep" to preserve value.
                </p>
              </div>

              {/* Insight 3 */}
              <div className="space-y-2 pt-4 border-t border-slate-100 dark:border-white/5">
                <span className="flex items-center gap-1.5 text-[9px] font-black text-emerald-500 uppercase tracking-widest">
                  <TrendingUp size={12} />
                  Stock Optimization
                </span>
                <div className="flex flex-col gap-1 text-[11px] font-bold text-slate-500">
                  <div className="flex justify-between">
                    <span>Organic Eggs</span>
                    <span className="text-emerald-500 uppercase">Optimal</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Greek Yogurt</span>
                    <span className="text-rose-500 uppercase">Low Stock</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </Card>

      </div>

      {/* Search and Table Section */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <Input
              placeholder="Search inventory assets..."
              className="pl-12 h-14 rounded-2xl bg-white dark:bg-zinc-900 border-none shadow-sm focus-visible:ring-brand-teal text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <Button
              onClick={() => dispatch(setBulkAddGroceryModalOpen(true))}
              variant="outline"
              className="h-14 flex-1 sm:flex-none px-6 rounded-2xl border-2 border-brand-teal/20 text-brand-teal font-black uppercase tracking-widest hover:bg-brand-teal/5 gap-2"
            >
              <Layers size={16} strokeWidth={2.5} />
              Batch Entry
            </Button>
            <Button 
              onClick={handleAdd} 
              className="h-14 flex-1 sm:flex-none px-8 rounded-2xl bg-brand-teal text-white font-black uppercase tracking-widest shadow-xl shadow-brand-teal/20 hover:scale-[1.02] active:scale-[0.98] transition-all gap-2"
            >
              <Plus className="h-5 w-5" strokeWidth={3} />
              Add Item
            </Button>
          </div>
        </div>

        {items.length > 0 ? (
          <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.02)] bg-white dark:bg-zinc-900 rounded-[40px] overflow-hidden">
            <div className="p-8 pb-4 flex justify-between items-center border-b border-slate-100 dark:border-white/5">
              <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">
                Inventory Register
              </h3>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl text-slate-400">
                  <SlidersHorizontal size={16} />
                </Button>
                <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl text-slate-400">
                  <Download size={16} />
                </Button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-white/5 text-[10px] font-black uppercase tracking-widest text-slate-400">
                    <th className="p-6 pl-8">Asset Name</th>
                    <th className="p-6">Classification</th>
                    <th className="p-6">Quantity</th>
                    <th className="p-6">Expiration</th>
                    <th className="p-6">Yield / Freshness</th>
                    <th className="p-6 pr-8 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                  {items.map((item) => {
                    const isExpired = item.expiryDate && new Date(item.expiryDate) < new Date();
                    const isLowStock = item.status === "LOW_STOCK";
                    const freshness = getFreshnessPct(item.expiryDate ?? undefined);

                    return (
                      <tr key={item.id} className="group hover:bg-slate-50 dark:hover:bg-white/5 transition-colors text-sm font-bold">
                        <td className="p-6 pl-8">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl bg-slate-50 dark:bg-white/5 flex items-center justify-center border border-slate-100 dark:border-white/10 group-hover:bg-white dark:group-hover:bg-zinc-800 transition-colors">
                              <Package className="h-5 w-5 text-slate-400" />
                            </div>
                            <span className="text-slate-900 dark:text-white uppercase tracking-tight">{item.name}</span>
                          </div>
                        </td>
                        <td className="p-6">
                          <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${getClassificationBadge(item.category ?? undefined)}`}>
                            {item.category || "Pantry"}
                          </span>
                        </td>
                        <td className="p-6">
                          <span className="text-slate-600 dark:text-zinc-300">
                            {item.quantity} {item.unit || "units"}
                          </span>
                        </td>
                        <td className="p-6">
                          {item.expiryDate ? (
                            <span className={`flex items-center gap-1 text-xs ${isExpired ? "text-rose-500 font-bold" : "text-slate-500"}`}>
                              <Calendar size={14} />
                              {isExpired ? "Expired" : format(new Date(item.expiryDate), "MMM d, yyyy")}
                            </span>
                          ) : (
                            <span className="text-slate-400">-</span>
                          )}
                        </td>
                        <td className="p-6">
                          <div className="flex items-center gap-3 w-40">
                            <div className="h-1.5 flex-1 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                              <div 
                                className={`h-full rounded-full transition-all ${
                                  freshness < 25 ? "bg-rose-500" : freshness < 60 ? "bg-amber-500" : "bg-brand-emerald"
                                }`} 
                                style={{ width: `${freshness}%` }} 
                              />
                            </div>
                            <span className="text-[10px] font-black text-slate-450 dark:text-zinc-500 w-8 text-right">
                              {freshness}%
                            </span>
                          </div>
                        </td>
                        <td className="p-6 pr-8 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => handleEdit(item)}
                              className="h-10 w-10 rounded-xl hover:text-brand-teal hover:bg-brand-teal/5"
                            >
                              <Edit2 size={15} />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => handleDelete(item.id)}
                              className="h-10 w-10 rounded-xl text-red-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10"
                            >
                              <Trash2 size={15} />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        ) : (
          <div className="text-center py-20 border-2 border-dashed rounded-[40px] bg-slate-50/50 dark:bg-white/5 border-slate-200 dark:border-white/10">
            <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">No grocery items found.</p>
            <Button variant="link" className="mt-2 text-brand-teal font-black uppercase tracking-wider text-xs" onClick={() => setSearchQuery("")}>
              Clear search
            </Button>
          </div>
        )}
      </div>

    </div>
  );
}
