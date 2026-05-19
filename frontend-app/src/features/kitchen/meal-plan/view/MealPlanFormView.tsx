"use client";

import React from "react";
import * as RHF from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Plus, Save, Trash2, Utensils, Beaker, Copy, Calendar } from "lucide-react";
import { FormField } from "@/components/ui/form-field";
import { AppSelect } from "@/components/ui/app-select";
import { format } from "date-fns";
import { INGREDIENT_DEFAULTS } from "../mealPlanSchema";

const FormProvider = (RHF as any).FormProvider;
const useFieldArray = (RHF as any).useFieldArray;
const Controller = (RHF as any).Controller;

interface MealPlanFormViewProps {
  form: any;
  fields: any[];
  groupedMeals: Array<{ date: string; indices: number[] }>;
  addMeal: () => void;
  duplicateMeal: (index: number) => void;
  removeMeal: (index: number) => void;
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  isLoading: boolean;
  isEditMode: boolean;
  groceries: any[];
}

export function MealPlanFormView({
  form,
  fields,
  groupedMeals,
  addMeal,
  duplicateMeal,
  removeMeal,
  onSubmit,
  isLoading,
  isEditMode,
  groceries,
}: MealPlanFormViewProps) {
  const { register, control } = form;

  return (
    <FormProvider {...form}>
      <form onSubmit={onSubmit} className="flex flex-col gap-8 p-10 pt-4">
        {/* Plan Basics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField name="startDate" label="Start Date">
            <Input
              type="date"
              className="h-14 rounded-2xl bg-slate-50 dark:bg-white/5 border-none shadow-inner"
              {...register("startDate")}
            />
          </FormField>
          <FormField name="endDate" label="End Date">
            <Input
              type="date"
              className="h-14 rounded-2xl bg-slate-50 dark:bg-white/5 border-none shadow-inner"
              {...register("endDate")}
            />
          </FormField>
        </div>

        <FormField name="status" label="Status">
          <Controller
            name="status"
            control={control}
            render={({ field }: any) => (
              <AppSelect
                value={field.value}
                onValueChange={field.onChange}
                placeholder="Select status"
                options={[
                  { id: "ACTIVE", label: "Active" },
                  { id: "ARCHIVED", label: "Archived" },
                ]}
              />
            )}
          />
        </FormField>

        {/* Meals Section */}
        <div className="space-y-10">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-black uppercase tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
              <Utensils size={24} className="text-brand-teal" />
              Plan Schedule
            </h3>
            <Button
              type="button"
              onClick={addMeal}
              variant="outline"
              className="h-12 rounded-xl border-2 border-brand-teal/20 text-brand-teal font-black uppercase tracking-widest hover:bg-brand-teal/5 gap-2 px-6"
            >
              <Plus size={18} strokeWidth={2.5} />
              Add Meal
            </Button>
          </div>

          <div className="space-y-12">
            {groupedMeals.length > 0 ? (
              groupedMeals.map(({ date, indices }) => (
                <div key={date} className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="h-px flex-1 bg-slate-200 dark:bg-white/10" />
                    <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                      <Calendar size={14} className="text-brand-teal" />
                      <span className="text-xs font-black uppercase tracking-widest text-slate-600 dark:text-zinc-400">
                        {date !== "No Date" ? format(new Date(date), "EEEE, MMM d") : "No Date Set"}
                      </span>
                    </div>
                    <div className="h-px flex-1 bg-slate-200 dark:bg-white/10" />
                  </div>
                  <div className="space-y-6">
                    {indices.map((index) => (
                      <MealItemRow
                        key={fields[index].id}
                        index={index}
                        register={register}
                        control={control}
                        removeMeal={removeMeal}
                        duplicateMeal={duplicateMeal}
                        groceries={groceries}
                        form={form}
                      />
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-20 rounded-[40px] bg-slate-50 dark:bg-white/5 border-2 border-dashed border-slate-200 dark:border-white/10">
                <Utensils size={48} className="text-slate-200 dark:text-white/10 mb-4" />
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">
                  No meals scheduled yet
                </p>
                <Button 
                  type="button" 
                  variant="link" 
                  className="text-brand-teal mt-2"
                  onClick={addMeal}
                >
                  Add your first meal
                </Button>
              </div>
            )}
          </div>
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="h-16 rounded-2xl bg-brand-teal text-white font-black uppercase tracking-widest shadow-xl shadow-brand-teal/20 hover:scale-[1.02] active:scale-[0.98] transition-all gap-3 mt-4"
        >
          {isLoading ? (
            <Loader2 className="h-6 w-6 animate-spin" />
          ) : (
            <>
              <Save size={20} strokeWidth={2.5} />
              {isEditMode ? "Update Meal Plan" : "Create Meal Plan"}
            </>
          )}
        </Button>
      </form>
    </FormProvider>
  );
}

function MealItemRow({ index, register, control, removeMeal, duplicateMeal, groceries }: any) {
  const {
    fields: ingredientFields,
    append: appendIngredient,
    remove: removeIngredient,
  } = useFieldArray({
    control,
    name: `meals.${index}.ingredients`,
  });


  return (
    <div className="group relative flex flex-col gap-6 p-6 rounded-3xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 transition-all hover:bg-slate-100 dark:hover:bg-white/10 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-black uppercase tracking-widest text-brand-teal bg-brand-teal/10 px-3 py-1 rounded-full">
            Meal #{index + 1}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => duplicateMeal(index)}
            className="p-2 text-slate-400 hover:text-brand-teal hover:bg-brand-teal/5 rounded-xl transition-all"
            title="Duplicate to next day"
          >
            <Copy size={16} />
          </button>
          <button
            type="button"
            onClick={() => removeMeal(index)}
            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <FormField name={`meals.${index}.date`} label="Date">
          <Input
            type="date"
            className="h-10 rounded-xl bg-white dark:bg-zinc-900 border-none shadow-sm"
            {...register(`meals.${index}.date`)}
          />
        </FormField>

        <FormField name={`meals.${index}.type`} label="Type">
          <Controller
            name={`meals.${index}.type`}
            control={control}
            render={({ field }: any) => (
              <AppSelect
                value={field.value}
                onValueChange={field.onChange}
                placeholder="Meal type"
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

        <FormField name={`meals.${index}.name`} label="Meal Name">
          <Input
            placeholder="e.g. Chicken Salad"
            className="h-10 rounded-xl bg-white dark:bg-zinc-900 border-none shadow-sm"
            {...register(`meals.${index}.name`)}
          />
        </FormField>
      </div>

      {/* Ingredients Section */}
      <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-white/10">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-zinc-400 flex items-center gap-2">
            <Beaker size={14} className="text-brand-emerald" />
            Ingredients
          </h4>
          <Button
            type="button"
            onClick={() => appendIngredient(INGREDIENT_DEFAULTS)}
            variant="ghost"
            size="sm"
            className="h-8 rounded-lg text-[10px] font-black uppercase tracking-widest text-brand-emerald hover:bg-brand-emerald/5 gap-1.5"
          >
            <Plus size={12} strokeWidth={3} />
            Add Ingredient
          </Button>
        </div>

        <div className="space-y-3">
          {ingredientFields.map((ingredientField: any, iIndex: number) => (
            <div key={ingredientField.id} className="flex items-end gap-3 group/item">
              <div className="flex-1 relative">
                <Input
                  list={`grocery-options-${index}-${iIndex}`}
                  placeholder="Ingredient name"
                  className="h-9 rounded-lg bg-white dark:bg-zinc-900 border-none shadow-sm text-xs"
                  {...register(`meals.${index}.ingredients.${iIndex}.name`)}
                />
                <datalist id={`grocery-options-${index}-${iIndex}`}>
                  {groceries.map((g: any) => (
                    <option key={g.id} value={g.name} />
                  ))}
                </datalist>
              </div>
              <div className="w-20">
                <Input
                  type="number"
                  placeholder="Qty"
                  className="h-9 rounded-lg bg-white dark:bg-zinc-900 border-none shadow-sm text-xs"
                  {...register(`meals.${index}.ingredients.${iIndex}.quantity`, {
                    valueAsNumber: true,
                  })}
                />
              </div>
              <div className="w-20">
                <Input
                  placeholder="Unit"
                  className="h-9 rounded-lg bg-white dark:bg-zinc-900 border-none shadow-sm text-xs"
                  {...register(`meals.${index}.ingredients.${iIndex}.unit`)}
                />
              </div>
              <button
                type="button"
                onClick={() => removeIngredient(iIndex)}
                className="p-2 text-slate-300 hover:text-red-400 transition-colors opacity-0 group-hover/item:opacity-100"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
          {ingredientFields.length === 0 && (
            <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest italic pl-1">
              No ingredients listed
            </p>
          )}
        </div>
      </div>

      <FormField name={`meals.${index}.notes`} label="Notes (Optional)">
        <Input
          placeholder="Extra instructions..."
          className="h-10 rounded-xl bg-white dark:bg-zinc-900 border-none shadow-sm"
          {...register(`meals.${index}.notes`)}
        />
      </FormField>
    </div>
  );
}
