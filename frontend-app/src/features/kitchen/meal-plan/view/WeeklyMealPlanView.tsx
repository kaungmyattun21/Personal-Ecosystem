"use client";

import React, { useState } from "react";
import { MealPlan, Meal } from "@/types/kitchen";
import { format, parseISO, isSameDay, addDays } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, 
  Utensils, 
  Coffee, 
  Sun, 
  Moon, 
  Apple,
  Calendar,
  Sparkles,
  ChevronRight,
  TrendingUp,
  Clock,
  Dna,
  CheckCircle,
  Plus,
  Compass,
  ArrowRight
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface WeeklyMealPlanViewProps {
  plan: MealPlan;
  days: Date[];
  selectedDay: Date | null;
  setSelectedDay: (day: Date | null) => void;
  viewMode: "cards" | "grid";
  setViewMode: (mode: "cards" | "grid") => void;
  getMealsForDay: (day: Date) => Meal[];
  onBack: () => void;
}

export function WeeklyMealPlanView({ 
  plan, 
  days, 
  selectedDay, 
  setSelectedDay, 
  viewMode,
  setViewMode,
  getMealsForDay, 
  onBack 
}: WeeklyMealPlanViewProps) {
  const selectedDayMeals = selectedDay ? getMealsForDay(selectedDay) : [];

  // Custom visual metrics representing macro/prep targets from Image 1
  const metrics = [
    { name: "Weekly ROI", value: "94%", detail: "+12% vs last week", isPositive: true, color: "text-brand-emerald" },
    { name: "Avg. Prep Time", value: "22 min", detail: "/ meal - Optimal", isPositive: null, color: "text-brand-teal" },
    { name: "Fiber Target", value: "32g", detail: "-4g from goal", isPositive: false, color: "text-rose-500" },
    { name: "Budget Health", value: "$142.50", detail: "Stable this week", isPositive: null, color: "text-slate-800 dark:text-zinc-200" }
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header and Back Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <Button 
            onClick={onBack}
            variant="ghost"
            size="icon"
            className="h-14 w-14 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/10 shadow-sm transition-all"
          >
            <ArrowLeft className="h-6 w-6 text-slate-800 dark:text-zinc-200" />
          </Button>
          <div>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
              Weekly Meal Plan
            </h2>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 mt-1">
              <Calendar size={14} className="text-brand-teal" />
              {format(parseISO(plan.startDate), "MMM d")} - {format(parseISO(plan.endDate), "MMM d, yyyy")}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center">
          <span className="text-[10px] font-black uppercase tracking-widest text-brand-emerald bg-brand-emerald/10 px-3 py-1.5 rounded-xl border border-brand-emerald/20 animate-pulse">
            Active Schedule
          </span>
        </div>
      </div>

      {/* 4 Premium Metrics Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((m, idx) => (
          <Card key={idx} className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.02)] bg-white dark:bg-zinc-900 rounded-[32px] overflow-hidden p-6 hover:scale-[1.01] transition-all">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
              {m.name}
            </span>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-3xl font-black tracking-tighter text-slate-900 dark:text-white">
                {m.value}
              </span>
              <span className={`text-[10px] font-bold uppercase ${
                m.isPositive === true ? "text-brand-emerald" : m.isPositive === false ? "text-rose-500" : "text-slate-400"
              }`}>
                {m.detail}
              </span>
            </div>
          </Card>
        ))}
      </div>

      {/* 2 Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column (Weekly Calendar Schedule Grid) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">
              Calendar Schedule
            </h3>
            <span className="text-xs font-black uppercase tracking-widest text-slate-450">
              7 Days Active
            </span>
          </div>

          {/* 7 Days Columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-7 gap-4">
            {days.map((day) => {
              const dayMeals = getMealsForDay(day);
              const isToday = isSameDay(day, new Date());

              return (
                <div 
                  key={day.toISOString()}
                  onClick={() => setSelectedDay(day)}
                  className={`flex flex-col justify-between rounded-[32px] p-5 cursor-pointer hover:scale-[1.02] hover:shadow-xl active:scale-[0.98] transition-all min-h-[280px] ${
                    isToday 
                      ? "bg-brand-teal text-white shadow-xl shadow-brand-teal/20" 
                      : "bg-white dark:bg-zinc-900 shadow-[0_8px_30px_rgb(0,0,0,0.02)] text-slate-950 dark:text-white"
                  }`}
                >
                  <div>
                    <div className="flex justify-between items-start">
                      <span className={`text-[9px] font-black uppercase tracking-[0.2em] ${isToday ? "text-white/80" : "text-slate-400"}`}>
                        {format(day, "EEE")}
                      </span>
                      {isToday && (
                        <div className="h-1.5 w-1.5 rounded-full bg-brand-emerald animate-pulse" />
                      )}
                    </div>
                    <h4 className="text-xl font-black tracking-tighter mt-1">
                      {format(day, "d")}
                    </h4>
                  </div>

                  {/* Scheduled Meals List */}
                  <div className="my-6 space-y-3 flex-1 flex flex-col justify-center">
                    {dayMeals.length > 0 ? (
                      dayMeals.slice(0, 3).map((meal) => (
                        <div 
                          key={meal.id} 
                          className={`rounded-2xl p-2.5 text-[11px] font-bold ${
                            isToday ? "bg-white/10 text-white" : "bg-slate-50 dark:bg-white/5 text-slate-700 dark:text-zinc-300"
                          }`}
                        >
                          <p className="uppercase text-[9px] tracking-wide text-brand-emerald mb-0.5">{meal.type}</p>
                          <p className="line-clamp-1">{meal.name}</p>
                        </div>
                      ))
                    ) : (
                      <p className={`text-[10px] font-bold uppercase tracking-widest text-center py-4 ${isToday ? "text-white/60" : "text-slate-300 dark:text-zinc-650"}`}>
                        No Meals
                      </p>
                    )}
                  </div>

                  {/* Micro Nutrients Summary Target */}
                  <div className={`border-t pt-4 ${isToday ? "border-white/10" : "border-slate-100 dark:border-white/5"}`}>
                    <div className={`flex justify-between text-[9px] font-black uppercase tracking-wider ${isToday ? "text-white/70" : "text-slate-400"}`}>
                      <span>P: 64g</span>
                      <span>C: 110g</span>
                      <span>F: 45g</span>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column (Suggestions & Macro Targets) */}
        <div className="space-y-8">
          
          {/* Smart Suggestions Box */}
          <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.02)] bg-white dark:bg-zinc-900 rounded-[40px] p-8">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">
                  Smart Suggestions
                </h3>
                <p className="text-xs font-medium text-slate-400">
                  Optimized recipes based on expiring pantry items
                </p>
              </div>

              <div className="space-y-4">
                
                {/* Suggestion 1 */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 space-y-2 border border-slate-100 dark:border-white/5 hover:border-brand-teal/20 transition-all cursor-pointer">
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] font-black text-brand-teal uppercase tracking-widest">
                      Greek Chickpea Stew
                    </span>
                    <span className="text-[9px] font-black text-brand-emerald bg-brand-emerald/10 px-2 py-0.5 rounded uppercase">
                      92% Match
                    </span>
                  </div>
                  <p className="text-xs font-bold text-slate-500 leading-normal">
                    Uses Spinach & Chickpeas entering the critical expiration window in less than 48 hours.
                  </p>
                </div>

                {/* Suggestion 2 */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 space-y-2 border border-slate-100 dark:border-white/5 hover:border-brand-teal/20 transition-all cursor-pointer">
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] font-black text-brand-teal uppercase tracking-widest">
                      Mediterranean Medley
                    </span>
                    <span className="text-[9px] font-black text-brand-emerald bg-brand-emerald/10 px-2 py-0.5 rounded uppercase">
                      85% Match
                    </span>
                  </div>
                  <p className="text-xs font-bold text-slate-500 leading-normal">
                    Incorporates low-stock organic eggs and ripe avocados. Excellent recovery profile.
                  </p>
                </div>

                <Button className="w-full h-12 rounded-2xl bg-brand-teal text-white font-black uppercase tracking-widest text-[10px] shadow-lg shadow-brand-teal/20 hover:scale-[1.01] active:scale-[0.99] transition-all">
                  Refill Expiring Items
                </Button>

              </div>
            </div>
          </Card>

          {/* Macro Performance Progress Bars */}
          <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.02)] bg-white dark:bg-zinc-900 rounded-[40px] p-8">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">
                  Macro Performance
                </h3>
                <p className="text-xs font-medium text-slate-400">
                  Target allocation progress levels
                </p>
              </div>

              {/* Progress items */}
              <div className="space-y-5">
                
                {/* Protein */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold text-slate-600 dark:text-zinc-400">
                    <span>Protein</span>
                    <span>68g / 85g Target</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-brand-emerald rounded-full" style={{ width: "80%" }} />
                  </div>
                </div>

                {/* Carbs */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold text-slate-600 dark:text-zinc-400">
                    <span>Carbohydrates</span>
                    <span>120g / 180g Target</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-brand-teal rounded-full" style={{ width: "66.6%" }} />
                  </div>
                </div>

                {/* Fats */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold text-slate-600 dark:text-zinc-400">
                    <span>Healthy Fats</span>
                    <span>45g / 65g Target</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full" style={{ width: "69.2%" }} />
                  </div>
                </div>

              </div>

              {/* Recovery Insight Notification */}
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs font-bold text-amber-600 dark:text-amber-450 leading-relaxed mt-4">
                "Increasing protein intake on Thursday by 15g will optimize your recovery for Friday's gym session."
              </div>

            </div>
          </Card>

        </div>

      </div>

      {/* Dialog for Selected Day Details */}
      <Dialog open={!!selectedDay} onOpenChange={(open) => !open && setSelectedDay(null)}>
        <DialogContent className="max-w-2xl rounded-[40px] border border-brand-teal/20 dark:border-brand-teal/40 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-2xl shadow-lg p-0 overflow-hidden max-h-[90vh] flex flex-col">
          <DialogHeader className="p-10 pb-4 flex flex-row items-center justify-between border-b border-slate-100 dark:border-white/5">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-2xl bg-brand-teal/10 flex items-center justify-center">
                <Calendar className="h-7 w-7 text-brand-teal" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                  {selectedDay ? format(selectedDay, "EEEE") : ""}
                </DialogTitle>
                <p className="text-sm font-medium text-slate-500 dark:text-zinc-400">
                  {selectedDay ? format(selectedDay, "MMMM do, yyyy") : ""}
                </p>
              </div>
            </div>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto p-10 space-y-8">
            {selectedDayMeals.length > 0 ? (
              selectedDayMeals.map((meal) => (
                <div key={meal.id} className="flex flex-col gap-4 p-6 rounded-[32px] bg-slate-50 dark:bg-white/5 text-sm">
                  <div className="flex items-center gap-3">
                    <Utensils size={16} className="text-brand-teal" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-brand-teal">{meal.type}</span>
                  </div>
                  <h4 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">{meal.name}</h4>
                  {meal.ingredients && meal.ingredients.length > 0 && (
                    <div className="space-y-2 mt-2">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">Ingredients</span>
                      <div className="grid grid-cols-2 gap-2">
                        {meal.ingredients.map((ing, i) => (
                          <div key={i} className="flex justify-between bg-white dark:bg-zinc-900 p-2.5 rounded-xl font-bold">
                            <span>{ing.name}</span>
                            <span className="text-brand-teal">{ing.quantity} {ing.unit}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-20 bg-slate-50 dark:bg-white/5 rounded-[32px] border-2 border-dashed border-slate-200 dark:border-white/10">
                <Utensils className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No meals scheduled for this day</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

    </div>
  );
}
