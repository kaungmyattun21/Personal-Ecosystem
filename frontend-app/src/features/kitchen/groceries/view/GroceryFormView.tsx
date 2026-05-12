"use client";

import React from "react";
import * as RHF from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Save } from "lucide-react";
import { FormField } from "@/components/ui/form-field";

const FormProvider = (RHF as any).FormProvider;

interface GroceryFormViewProps {
  form: any;
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  isLoading: boolean;
  isEditMode: boolean;
}

export function GroceryFormView({
  form,
  onSubmit,
  isLoading,
  isEditMode,
}: GroceryFormViewProps) {
  const { register } = form;

  return (
    <FormProvider {...form}>
      <form onSubmit={onSubmit} className="flex flex-col gap-6 p-10 pt-4">
        <div className="space-y-4">
          <FormField name="name" label="Item Name">
            <Input
              placeholder="e.g., Organic Milk"
              className="h-12 rounded-xl bg-slate-50 dark:bg-white/5 border-none"
              {...register("name")}
            />
          </FormField>

          <div className="grid grid-cols-2 gap-4">
            <FormField name="category" label="Category">
              <Input
                placeholder="e.g., Dairy"
                className="h-12 rounded-xl bg-slate-50 dark:bg-white/5 border-none"
                {...register("category")}
              />
            </FormField>
            <FormField name="unit" label="Unit">
              <Input
                placeholder="e.g., liters"
                className="h-12 rounded-xl bg-slate-50 dark:bg-white/5 border-none"
                {...register("unit")}
              />
            </FormField>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField name="quantity" label="Quantity">
              <Input
                type="number"
                step="any"
                className="h-12 rounded-xl bg-slate-50 dark:bg-white/5 border-none"
                {...register("quantity", { valueAsNumber: true })}
              />
            </FormField>
            <FormField name="expiryDate" label="Expiry Date">
              <Input
                type="date"
                className="h-12 rounded-xl bg-slate-50 dark:bg-white/5 border-none"
                {...register("expiryDate")}
              />
            </FormField>
          </div>
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="h-14 rounded-2xl bg-brand-teal text-white font-black uppercase tracking-widest shadow-xl shadow-brand-teal/20 hover:scale-[1.02] active:scale-[0.98] transition-all gap-3"
        >
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <>
              <Save size={18} strokeWidth={2.5} />
              {isEditMode ? "Update Item" : "Save Item"}
            </>
          )}
        </Button>
      </form>
    </FormProvider>
  );
}
