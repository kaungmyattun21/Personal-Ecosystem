"use client";

import React, { useState } from "react";
import { useMealPlanForm } from "../hooks/useMealPlanForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft,
  Save,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Plus,
  Trash2,
  Utensils,
  Coffee,
  Sun,
  Moon,
  Apple,
  Beaker,
  Copy,
  CheckCircle2,
} from "lucide-react";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { FormField } from "@/components/ui/form-field";
import { AppSelect } from "@/components/ui/app-select";
import { INGREDIENT_DEFAULTS } from "../mealPlanSchema";
import * as RHF from "react-hook-form";

const FormProvider = (RHF as any).FormProvider;
const Controller = (RHF as any).Controller;
const useFieldArray = (RHF as any).useFieldArray;
const useFormContext = (RHF as any).useFormContext;

export function MealPlanEditorView() {
  const {
    form,
    fields,
    groupedMeals,
    addMeal,
    duplicateMeal,
    removeDay,
    removeMeal,
    onSubmit,
    isLoading,
    isEditMode,
    groceries,
    onClose,
  } = useMealPlanForm();

  const [activeDayIndex, setActiveDayIndex] = useState(0);
  const { register, control, watch } = form;

  const currentGroup = groupedMeals[activeDayIndex] || {
    date: "No Date",
    indices: [],
  };
  const progress = Math.min(
    100,
    Math.round((fields.filter((f: any) => f.name).length / (7 * 3)) * 100),
  );

  return (
    <FormProvider {...form}>
      <form
        onSubmit={onSubmit}
        className="min-h-screen bg-slate-50 dark:bg-zinc-950 flex flex-col"
      >
        {/* Sticky Header */}
        <header className="sticky top-0 z-30 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-white/10 px-8 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-8">
            <div className="flex items-center gap-4 flex-1">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="h-12 w-12 rounded-2xl bg-slate-100 dark:bg-white/5 shadow-sm hover:bg-slate-200"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="flex-1 max-w-md">
                <h1 className="text-xl font-black uppercase tracking-tight italic text-slate-900 dark:text-white">
                  {isEditMode ? "Editing Meal Plan" : "Create New Plan"}
                </h1>
                <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                  <Calendar size={12} />
                  <span>
                    {format(new Date(watch("startDate")), "MMM d")} -{" "}
                    {format(new Date(watch("endDate")), "MMM d, yyyy")}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="ghost"
                onClick={() => removeDay(currentGroup.date)}
                className="h-12 px-6 rounded-2xl text-xs font-black uppercase tracking-widest text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 gap-2"
              >
                <Trash2 size={16} />
                Clear Day
              </Button>
              <div className="hidden md:flex flex-col items-end mr-4">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Planning Progress
                </span>
                <div className="w-32 h-1.5 bg-slate-100 dark:bg-white/10 rounded-full mt-1 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    className="h-full bg-brand-teal"
                  />
                </div>
              </div>
              <Button
                type="submit"
                disabled={isLoading}
                className="h-12 px-8 rounded-2xl bg-brand-teal text-white font-black uppercase tracking-widest shadow-lg shadow-brand-teal/20 hover:scale-[1.05] transition-all gap-2"
              >
                {isLoading ? (
                  <Plus className="animate-spin" />
                ) : (
                  <Save size={18} />
                )}
                {isEditMode ? "Update" : "Save Plan"}
              </Button>
            </div>
          </div>
        </header>

        <main className="flex-1 max-w-7xl mx-auto w-full p-8 flex flex-col gap-8">
          {/* Day Selector */}
          <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-hide">
            {groupedMeals.map((group: any, idx: number) => (
              <button
                key={group.date}
                type="button"
                onClick={() => setActiveDayIndex(idx)}
                className={`flex-1 min-w-[140px] p-4 rounded-3xl transition-all border-2 ${
                  activeDayIndex === idx
                    ? "bg-brand-teal border-brand-teal shadow-xl shadow-brand-teal/20 -translate-y-1"
                    : "bg-white dark:bg-white/5 border-transparent hover:bg-slate-100 dark:hover:bg-white/10"
                }`}
              >
                <p
                  className={`text-[10px] font-black uppercase tracking-widest mb-1 ${activeDayIndex === idx ? "text-white/70" : "text-brand-teal/70"}`}
                >
                  {group.date !== "No Date"
                    ? format(new Date(group.date), "EEEE")
                    : "No Date"}
                </p>
                <h3
                  className={`text-lg font-black italic tracking-tight ${activeDayIndex === idx ? "text-white" : "text-slate-900 dark:text-white"}`}
                >
                  {group.date !== "No Date"
                    ? format(new Date(group.date), "MMM d")
                    : "No Date"}
                </h3>
                <div className="mt-2 flex gap-1">
                  {group.indices.map((i: number) => (
                    <div
                      key={i}
                      className={`h-1 flex-1 rounded-full ${activeDayIndex === idx ? "bg-white/30" : "bg-brand-teal/20"}`}
                    />
                  ))}
                </div>
              </button>
            ))}
          </div>

          {/* Active Day Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentGroup.date}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            >
              {currentGroup.indices.map((index: number) => (
                <MealEditorCard
                  key={fields[index].id}
                  index={index}
                  register={register}
                  control={control}
                  groceries={groceries}
                  duplicateMeal={duplicateMeal}
                  removeMeal={removeMeal}
                />
              ))}

              <button
                type="button"
                onClick={() => addMeal(currentGroup.date)}
                className="flex flex-col items-center justify-center gap-4 p-8 rounded-[40px] border-4 border-dashed border-slate-200 dark:border-white/10 hover:border-brand-teal/40 hover:bg-brand-teal/5 transition-all group"
              >
                <div className="h-16 w-16 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center group-hover:bg-brand-teal group-hover:text-white transition-colors">
                  <Plus size={32} />
                </div>
                <span className="font-black uppercase tracking-widest text-slate-400 group-hover:text-brand-teal">
                  Add Meal To Day
                </span>
              </button>
            </motion.div>
          </AnimatePresence>
        </main>
      </form>
    </FormProvider>
  );
}

function MealEditorCard({
  index,
  register,
  control,
  groceries,
  duplicateMeal,
  removeMeal,
}: any) {
  const { watch } = useFormContext() as any;
  const {
    fields: ingredientFields,
    append: appendIngredient,
    remove: removeIngredient,
  } = useFieldArray({
    control,
    name: `meals.${index}.ingredients`,
  });

  const mealType = watch(`meals.${index}.type`);

  const getIcon = (type: string) => {
    switch (type) {
      case "BREAKFAST":
        return <Coffee className="text-amber-500" />;
      case "LUNCH":
        return <Sun className="text-orange-500" />;
      case "DINNER":
        return <Moon className="text-indigo-500" />;
      default:
        return <Apple className="text-brand-teal" />;
    }
  };

  return (
    <div className="relative group bg-white dark:bg-white/5 rounded-[40px] shadow-sm border border-slate-200 dark:border-white/10 overflow-hidden transition-all hover:shadow-2xl">
      <div className="p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-slate-50 dark:bg-white/5 flex items-center justify-center">
              {getIcon(mealType)}
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-brand-teal/70">
                Meal Configuration
              </p>
              <h4 className="text-lg font-black text-slate-900 dark:text-white uppercase italic">
                Meal #{index + 1}
              </h4>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => duplicateMeal(index)}
              className="h-10 w-10 rounded-xl hover:text-brand-teal hover:bg-brand-teal/5"
            >
              <Copy size={16} />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => removeMeal(index)}
              className="h-10 w-10 rounded-xl hover:text-red-500 hover:bg-red-50"
            >
              <Trash2 size={16} />
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <FormField name={`meals.${index}.type`} label="Time Of Day">
            <Controller
              name={`meals.${index}.type`}
              control={control}
              render={({ field }: any) => (
                <AppSelect
                  value={field.value}
                  onValueChange={field.onChange}
                  placeholder="Select type"
                  options={[
                    { id: "BREAKFAST", label: "Breakfast" },
                    { id: "LUNCH", label: "Lunch" },
                    { id: "DINNER", label: "Dinner" },
                    { id: "SNACK", label: "Snack" },
                  ]}
                />
              )}
            />
          </FormField>

          <FormField name={`meals.${index}.name`} label="What's for meal?">
            <Input
              placeholder="e.g. Avocado Toast"
              className="h-12 rounded-2xl bg-slate-50 dark:bg-zinc-900 border-none shadow-inner"
              {...register(`meals.${index}.name`)}
            />
          </FormField>
        </div>

        {/* Ingredients */}
        <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-white/5">
          <div className="flex items-center justify-between">
            <h5 className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
              <Beaker size={14} className="text-brand-emerald" />
              Required Ingredients
            </h5>
            <Button
              type="button"
              onClick={() => appendIngredient(INGREDIENT_DEFAULTS)}
              variant="ghost"
              size="sm"
              className="h-8 rounded-lg text-[10px] font-black text-brand-emerald hover:bg-brand-emerald/5 uppercase tracking-widest"
            >
              <Plus size={14} className="mr-1" /> Add
            </Button>
          </div>

          <div className="space-y-3">
            {ingredientFields.map((ing: any, iIdx: number) => (
              <div key={ing.id} className="flex items-center gap-2 group/ing">
                <Input
                  placeholder="Item"
                  className="h-10 rounded-xl bg-slate-50 dark:bg-zinc-900 border-none text-xs flex-1"
                  {...register(`meals.${index}.ingredients.${iIdx}.name`)}
                />
                <Input
                  type="number"
                  placeholder="Qty"
                  className="h-10 w-16 rounded-xl bg-slate-50 dark:bg-zinc-900 border-none text-xs"
                  {...register(`meals.${index}.ingredients.${iIdx}.quantity`, {
                    valueAsNumber: true,
                  })}
                />
                <Input
                  placeholder="Unit"
                  className="h-10 w-16 rounded-xl bg-slate-50 dark:bg-zinc-900 border-none text-xs"
                  {...register(`meals.${index}.ingredients.${iIdx}.unit`)}
                />
                <button
                  type="button"
                  onClick={() => removeIngredient(iIdx)}
                  className="p-2 text-slate-300 hover:text-red-500 opacity-0 group-hover/ing:opacity-100 transition-opacity"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
