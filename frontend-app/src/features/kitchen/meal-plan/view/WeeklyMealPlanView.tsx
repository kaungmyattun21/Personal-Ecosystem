"use client";

import React from "react";
import { MealPlan, Meal } from "@/types/kitchen";
import { format, parseISO, isSameDay } from "date-fns";
import { MealPlanGridView } from "./MealPlanGridView";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, 
  ChevronRight, 
  Utensils, 
  Coffee, 
  Sun, 
  Moon, 
  Apple,
  Calendar,
  Beaker,
  Info,
  LayoutGrid,
  Square
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

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onBack}
            className="h-14 w-14 rounded-2xl bg-white dark:bg-white/5 shadow-sm border border-slate-200 dark:border-white/10 hover:bg-slate-100 transition-all"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <div>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight italic">
              Weekly Plan
            </h2>
            <p className="text-sm font-medium text-slate-500 dark:text-zinc-400 flex items-center gap-2">
              <Calendar size={14} className="text-brand-teal" />
              {format(parseISO(plan.startDate), "MMM d")} - {format(parseISO(plan.endDate), "MMM d, yyyy")}
            </p>
          </div>
        </div>

        {/* View Toggle */}
        <div className="bg-slate-100 dark:bg-white/5 p-1 rounded-2xl flex items-center border border-slate-200 dark:border-white/10 self-start md:self-center">
          <button
            onClick={() => setViewMode("cards")}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
              viewMode === "cards" 
                ? "bg-white dark:bg-white/10 text-brand-teal shadow-sm" 
                : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            }`}
          >
            <Square size={14} />
            Cards
          </button>
          <button
            onClick={() => setViewMode("grid")}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
              viewMode === "grid" 
                ? "bg-white dark:bg-white/10 text-brand-teal shadow-sm" 
                : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            }`}
          >
            <LayoutGrid size={14} />
            Grid
          </button>
        </div>
      </div>

      {viewMode === "cards" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
          {days.map((day) => {
            const dayMeals = getMealsForDay(day);
            return (
              <DayCard 
                key={day.toISOString()} 
                day={day} 
                meals={dayMeals} 
                onClick={() => setSelectedDay(day)} 
              />
            );
          })}
        </div>
      ) : (
        <MealPlanGridView 
          plan={plan} 
          days={days} 
          getMealsForDay={getMealsForDay} 
        />
      )}

      <Dialog open={!!selectedDay} onOpenChange={(open) => !open && setSelectedDay(null)}>
        <DialogContent className="max-w-2xl rounded-[40px] border border-brand-teal/20 dark:border-brand-teal/40 bg-white/80 dark:bg-brand-bg-dark/80 backdrop-blur-2xl shadow-lg p-0 overflow-hidden max-h-[90vh] flex flex-col">
          <DialogHeader className="p-10 pb-4 flex flex-row items-center justify-between bg-white/50 dark:bg-black/20 backdrop-blur-md border-b border-slate-200 dark:border-white/10">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-2xl bg-brand-teal/10 flex items-center justify-center">
                <Calendar className="h-7 w-7 text-brand-teal" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight italic">
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
                <MealDetailCard key={meal.id} meal={meal} />
              ))
            ) : (
              <div className="text-center py-20 bg-slate-50/50 dark:bg-white/5 rounded-[32px] border-2 border-dashed border-slate-200 dark:border-white/10">
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

function DayCard({ day, meals, onClick }: { day: Date; meals: Meal[]; onClick: () => void }) {
  const isToday = isSameDay(day, new Date());
  
  return (
    <Card 
      className={`relative group cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-xl active:scale-95 rounded-[32px] overflow-hidden border-none ${
        isToday 
          ? "bg-brand-teal text-white shadow-brand-teal/20" 
          : "bg-white dark:bg-white/5 shadow-sm hover:bg-slate-50 dark:hover:bg-white/10"
      }`}
      onClick={onClick}
    >
      <div className="p-6 flex flex-col h-full min-h-[180px]">
        <div className="mb-4">
          <p className={`text-[10px] font-black uppercase tracking-[0.2em] mb-1 ${isToday ? "text-white/70" : "text-brand-teal/70"}`}>
            {format(day, "EEEE")}
          </p>
          <h3 className="text-2xl font-black italic tracking-tighter">
            {format(day, "MMM d")}
          </h3>
        </div>

        <div className="mt-auto space-y-2">
          {meals.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {meals.map((meal) => (
                <div 
                  key={meal.id} 
                  className={`h-2 w-2 rounded-full ${isToday ? "bg-white/40" : "bg-brand-teal/20"}`} 
                />
              ))}
            </div>
          ) : null}
          <div className="flex items-center justify-between">
            <span className={`text-[10px] font-black uppercase tracking-widest ${isToday ? "text-white/80" : "text-slate-400"}`}>
              {meals.length} Meals
            </span>
            <ChevronRight size={16} className={`transition-transform group-hover:translate-x-1 ${isToday ? "text-white/80" : "text-brand-teal/50"}`} />
          </div>
        </div>
      </div>
    </Card>
  );
}

function MealDetailCard({ meal }: { meal: Meal }) {
  const getIcon = (type: string) => {
    switch (type) {
      case "BREAKFAST": return <Coffee className="text-amber-500" />;
      case "LUNCH": return <Sun className="text-orange-500" />;
      case "DINNER": return <Moon className="text-indigo-500" />;
      default: return <Apple className="text-brand-teal" />;
    }
  };

  return (
    <div className="flex flex-col gap-6 p-8 rounded-[32px] bg-white/50 dark:bg-white/5 border border-slate-200 dark:border-white/10 transition-all shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-white dark:bg-white/10 shadow-sm flex items-center justify-center">
            {getIcon(meal.type)}
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-teal/70">
              {meal.type}
            </p>
            <h4 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight italic">
              {meal.name}
            </h4>
          </div>
        </div>
      </div>

      {meal.ingredients && meal.ingredients.length > 0 && (
        <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-white/10">
          <h5 className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-zinc-400 flex items-center gap-2">
            <Beaker size={14} className="text-brand-emerald" />
            Ingredients
          </h5>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {meal.ingredients.map((ing, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-white/5 text-sm">
                <span className="font-bold text-slate-700 dark:text-zinc-300">{ing.name}</span>
                <span className="text-xs font-black text-brand-teal bg-brand-teal/10 px-2 py-0.5 rounded-lg">
                  {ing.quantity} {ing.unit}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {meal.notes && (
        <div className="space-y-2 pt-4 border-t border-slate-200 dark:border-white/10">
          <h5 className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-zinc-400 flex items-center gap-2">
            <Info size={14} className="text-blue-500" />
            Notes
          </h5>
          <p className="text-sm text-slate-600 dark:text-zinc-400 italic">
            {meal.notes}
          </p>
        </div>
      )}
    </div>
  );
}
