"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Clock, 
  Sparkles, 
  TrendingUp, 
  Flame, 
  Award, 
  ArrowRight,
  UtensilsCrossed,
  SlidersHorizontal,
  Bookmark
} from "lucide-react";

export function RecipesView() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All Recipes");

  const categories = [
    "All Recipes", 
    "Keto Friendly", 
    "Vegan", 
    "High Protein", 
    "Under 30 Mins", 
    "Slow Cooked"
  ];

  const recipes = [
    {
      id: "rec-2",
      name: "Harvest Wellness Bowl",
      category: "Keto Friendly",
      time: "15 mins",
      difficulty: "Easy",
      match: "75%",
      calories: "850 kcal",
      tags: ["High Fiber", "Healthy Fats"]
    },
    {
      id: "rec-3",
      name: "Greek Estate Salad",
      category: "Vegan",
      time: "10 mins",
      difficulty: "Easy",
      match: "40%",
      calories: "280 kcal",
      tags: ["Light", "Raw Ingredients"]
    },
    {
      id: "rec-4",
      name: "Heirloom Tomato Linguine",
      category: "Under 30 Mins",
      time: "35 mins",
      difficulty: "Intermediate",
      match: "98%",
      calories: "510 kcal",
      tags: ["Ready to Cook", "Pasta"]
    },
    {
      id: "rec-5",
      name: "Prime Steak Au Poivre",
      category: "High Protein",
      time: "45 mins",
      difficulty: "Advanced",
      match: "65%",
      calories: "680 kcal",
      tags: ["Premium", "Sautéed"]
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Search and Category Filters Row */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <Input
              placeholder="Search culinary intelligence..."
              className="pl-12 h-14 rounded-2xl bg-white dark:bg-zinc-900 border-none shadow-sm focus-visible:ring-brand-teal text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" className="h-14 w-full sm:w-auto px-6 rounded-2xl border-none bg-white dark:bg-zinc-900 shadow-sm gap-2 font-black uppercase tracking-widest text-[10px]">
            <SlidersHorizontal size={16} />
            Filters
          </Button>
        </div>

        {/* Categories TabList */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat, idx) => (
            <button
              key={idx}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                activeCategory === cat 
                  ? "bg-brand-teal text-white shadow-lg shadow-brand-teal/20" 
                  : "bg-white dark:bg-zinc-900 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column (Top Match Hero Card taking full height / prominent spot) */}
        <div className="lg:col-span-1 h-full">
          <Card className="border-none shadow-xl bg-white dark:bg-zinc-900 rounded-[40px] overflow-hidden flex flex-col justify-between h-full min-h-[500px]">
            {/* Visual Header Placeholder */}
            <div className="h-64 w-full bg-gradient-to-tr from-brand-teal/30 via-brand-emerald/10 to-transparent flex flex-col justify-between p-6 border-b border-slate-100 dark:border-white/5 relative">
              <div className="flex justify-between items-start w-full">
                <span className="flex items-center gap-1 text-[9px] font-black text-brand-teal bg-white dark:bg-zinc-900 px-3 py-1.5 rounded-xl shadow-sm uppercase tracking-widest">
                  <Sparkles size={12} className="text-brand-teal" />
                  Top Match
                </span>
                <button className="h-10 w-10 rounded-xl bg-white/90 dark:bg-zinc-900/90 flex items-center justify-center shadow-sm">
                  <Bookmark size={16} className="text-slate-600 dark:text-zinc-300" />
                </button>
              </div>

              <div>
                <span className="text-[9px] font-black text-brand-emerald bg-brand-emerald/10 px-2 py-0.5 rounded uppercase tracking-wider">
                  92% Inventory Match
                </span>
                <h3 className="text-2xl font-black text-slate-950 dark:text-white uppercase tracking-tight mt-2 leading-none">
                  Pan-Seared Atlantic Salmon
                </h3>
              </div>
            </div>

            <CardContent className="p-8 space-y-6 flex-1 flex flex-col justify-between">
              <div className="space-y-4">
                <p className="text-xs font-bold text-slate-500 leading-relaxed">
                  Highly compatible with your current fridge contents. Uses expiring asparagus spears and fresh lemon wedges perfectly.
                </p>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100 dark:border-white/5 text-xs font-bold text-slate-400">
                  <div className="flex items-center gap-2">
                    <Clock size={16} className="text-brand-teal" />
                    <span>25 Mins Prep</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award size={16} className="text-amber-500" />
                    <span>Intermediate</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-white/5 space-y-2">
                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Estimated Macros</span>
                  <div className="grid grid-cols-4 gap-2 text-center text-[10px] font-black uppercase text-slate-650">
                    <div className="bg-slate-50 dark:bg-white/5 p-2 rounded-xl">
                      <p className="text-brand-teal">420</p>
                      <p className="text-[8px] text-slate-400 mt-0.5">kcal</p>
                    </div>
                    <div className="bg-slate-50 dark:bg-white/5 p-2 rounded-xl">
                      <p className="text-brand-emerald">42g</p>
                      <p className="text-[8px] text-slate-400 mt-0.5">Prot</p>
                    </div>
                    <div className="bg-slate-50 dark:bg-white/5 p-2 rounded-xl">
                      <p className="text-amber-500">28g</p>
                      <p className="text-[8px] text-slate-400 mt-0.5">Fat</p>
                    </div>
                    <div className="bg-slate-50 dark:bg-white/5 p-2 rounded-xl">
                      <p className="text-rose-500">8g</p>
                      <p className="text-[8px] text-slate-400 mt-0.5">Carb</p>
                    </div>
                  </div>
                </div>
              </div>

              <Button className="w-full h-14 rounded-2xl bg-slate-900 hover:bg-slate-950 text-white font-black uppercase tracking-widest text-[10px] mt-6 flex items-center justify-center gap-1">
                View Intelligence Report
                <ArrowRight size={14} />
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right Columns (2/3 width grid for other curated recipes) */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6 h-full">
          {recipes.map((rec) => (
            <Card key={rec.id} className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.02)] bg-white dark:bg-zinc-900 rounded-[36px] overflow-hidden p-6 hover:scale-[1.01] hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start">
                  <span className="text-[9px] font-black text-brand-teal bg-brand-teal/10 px-2.5 py-1 rounded-xl uppercase tracking-widest">
                    {rec.category}
                  </span>
                  <span className="text-[9px] font-black text-brand-emerald bg-brand-emerald/10 px-2 py-0.5 rounded uppercase tracking-wider">
                    {rec.match} Match
                  </span>
                </div>

                <h4 className="text-lg font-black text-slate-950 dark:text-white uppercase tracking-tight mt-4 leading-snug">
                  {rec.name}
                </h4>

                <div className="flex flex-wrap gap-1.5 mt-3">
                  {rec.tags.map((tag, i) => (
                    <span key={i} className="text-[8px] font-black uppercase tracking-wider bg-slate-50 dark:bg-white/5 text-slate-400 px-2 py-0.5 rounded-md">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-xs font-bold text-slate-400">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <Clock size={14} className="text-slate-400" />
                    {rec.time}
                  </span>
                  <span>•</span>
                  <span>{rec.difficulty}</span>
                </div>
                <span className="text-slate-900 dark:text-white">{rec.calories}</span>
              </div>
            </Card>
          ))}
        </div>

      </div>

    </div>
  );
}
