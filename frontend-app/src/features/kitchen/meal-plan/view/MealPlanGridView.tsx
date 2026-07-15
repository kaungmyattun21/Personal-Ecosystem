"use client";

import React from "react";
import { MealPlan, Meal } from "@/types/kitchen";
import { format, isSameDay } from "date-fns";
import { Coffee, Sun, Moon, Apple, Info } from "lucide-react";
import { motion } from "framer-motion";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface MealPlanGridViewProps {
  plan: MealPlan;
  days: Date[];
  getMealsForDay: (day: Date) => Meal[];
}

const MEAL_TYPES = [
  { id: "BREAKFAST", label: "Breakfast", icon: <Coffee size={14} className="text-amber-500" /> },
  { id: "LUNCH", label: "Lunch", icon: <Sun size={14} className="text-orange-500" /> },
  { id: "DINNER", label: "Dinner", icon: <Moon size={14} className="text-indigo-500" /> },
  { id: "SNACK", label: "Snack", icon: <Apple size={14} className="text-brand-teal" /> },
];

export function MealPlanGridView({ plan, days, getMealsForDay }: MealPlanGridViewProps) {
  return (
    <div className="bg-white dark:bg-white/5 rounded-[40px] border border-slate-200 dark:border-white/10 overflow-hidden shadow-xl">
      <div className="overflow-x-auto">
        <div className="min-w-[1000px]">
          {/* Grid Header */}
          <div className="grid grid-cols-[140px_repeat(7,1fr)] border-b border-slate-100 dark:border-white/5">
            <div className="p-6 bg-slate-50/50 dark:bg-white/5 flex items-center justify-center border-r border-slate-100 dark:border-white/5">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Meal \ Day</span>
            </div>
            {days.map((day) => (
              <div 
                key={day.toISOString()} 
                className={`p-6 text-center border-r border-slate-100 dark:border-white/5 last:border-r-0 ${
                  isSameDay(day, new Date()) ? "bg-brand-teal/5" : ""
                }`}
              >
                <p className="text-[10px] font-black uppercase tracking-widest text-brand-teal/70 mb-1">
                  {format(day, "EEEE")}
                </p>
                <h4 className="text-lg font-black tracking-tighter text-slate-900 dark:text-white">
                  {format(day, "MMM d")}
                </h4>
              </div>
            ))}
          </div>

          {/* Grid Rows */}
          <div className="flex flex-col">
            {MEAL_TYPES.map((type) => (
              <div key={type.id} className="grid grid-cols-[140px_repeat(7,1fr)] border-b border-slate-100 dark:border-white/5 last:border-b-0 group">
                <div className="p-6 bg-slate-50/50 dark:bg-white/5 flex flex-col items-center justify-center border-r border-slate-100 dark:border-white/5 group-hover:bg-slate-100 dark:group-hover:bg-white/10 transition-colors">
                  <div className="h-10 w-10 rounded-xl bg-white dark:bg-white/10 shadow-sm flex items-center justify-center mb-2">
                    {type.icon}
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-400">
                    {type.label}
                  </span>
                </div>

                {days.map((day) => {
                  const dayMeals = getMealsForDay(day);
                  const meal = dayMeals.find((m) => m.type === type.id);

                  return (
                    <div 
                      key={`${day.toISOString()}-${type.id}`} 
                      className={`p-4 border-r border-slate-100 dark:border-white/5 last:border-r-0 min-h-[120px] transition-all hover:bg-slate-50/50 dark:hover:bg-white/5 ${
                        isSameDay(day, new Date()) ? "bg-brand-teal/[0.02]" : ""
                      }`}
                    >
                      {meal ? (
                        <motion.div
                          initial={{ scale: 0.95, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="h-full bg-white dark:bg-zinc-900 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-white/10 flex flex-col justify-between group/meal relative"
                        >
                          <div>
                            <h5 className="text-xs font-black text-slate-900 dark:text-white leading-tight line-clamp-2 uppercase mb-2">
                              {meal.name}
                            </h5>
                            {meal.ingredients && meal.ingredients.length > 0 && (
                              <div className="flex flex-wrap gap-1">
                                {meal.ingredients.slice(0, 2).map((ing, i) => (
                                  <span key={i} className="text-[8px] font-bold px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-white/5 text-slate-500 uppercase tracking-tighter">
                                    {ing.name}
                                  </span>
                                ))}
                                {meal.ingredients.length > 2 && (
                                  <span className="text-[8px] font-bold text-slate-400">+{meal.ingredients.length - 2} more</span>
                                )}
                              </div>
                            )}
                          </div>

                          <div className="mt-4 flex items-center justify-between">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <button className="text-slate-300 hover:text-brand-teal transition-colors">
                                    <Info size={12} />
                                  </button>
                                </TooltipTrigger>
                                <TooltipContent className="rounded-2xl p-4 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl border border-slate-200 dark:border-white/10 shadow-2xl">
                                  <div className="space-y-2 max-w-[200px]">
                                    <p className="text-xs font-black uppercase text-brand-teal">Ingredients:</p>
                                    <ul className="space-y-1">
                                      {meal.ingredients?.map((ing, i) => (
                                        <li key={i} className="text-[10px] font-bold text-slate-600 dark:text-slate-300 flex justify-between gap-4">
                                          <span>• {ing.name}</span>
                                          <span className="text-slate-400">{ing.quantity} {ing.unit}</span>
                                        </li>
                                      ))}
                                    </ul>
                                    {meal.notes && (
                                      <>
                                        <p className="text-xs font-black uppercase text-brand-teal mt-2">Notes:</p>
                                        <p className="text-[10px] font-medium text-slate-500">{meal.notes}</p>
                                      </>
                                    )}
                                  </div>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        </motion.div>
                      ) : (
                        <div className="h-full rounded-2xl border-2 border-dashed border-slate-100 dark:border-white/5 flex items-center justify-center">
                          <span className="text-[8px] font-black uppercase tracking-widest text-slate-300">Empty</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
