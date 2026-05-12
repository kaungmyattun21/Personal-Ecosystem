"use client";

import React from "react";
import * as RHF from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Plus, Save, Trash2 } from "lucide-react";
import { FormField } from "@/components/ui/form-field";

// Bypassing TS for FormProvider
const FormProvider = (RHF as any).FormProvider;

interface BulkAddGroceryFormViewProps {
  form: any;
  fields: any[];
  addRow: () => void;
  removeRow: (index: number) => void;
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  isLoading: boolean;
}

export function BulkAddGroceryFormView({
  form,
  fields,
  addRow,
  removeRow,
  onSubmit,
  isLoading,
}: BulkAddGroceryFormViewProps) {
  const { register } = form;

  return (
    <FormProvider {...form}>
      <form onSubmit={onSubmit} className="flex flex-col h-full">
        <div className="flex-1 overflow-y-auto p-10 pt-2 space-y-6">
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="group relative flex flex-col gap-6 p-8 rounded-[32px] bg-white/50 dark:bg-white/5 border border-slate-200 dark:border-white/10 transition-all hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="flex items-center justify-center h-8 w-8 rounded-full bg-brand-teal text-white text-xs font-black">
                    {index + 1}
                  </span>
                  <span className="text-xs font-black uppercase tracking-[0.2em] text-brand-teal/70">
                    Grocery Item Details
                  </span>
                </div>
                {fields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeRow(index)}
                    className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-2xl transition-all"
                  >
                    <Trash2 size={20} />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <FormField name={`items.${index}.name`} label="Item Name">
                  <Input
                    placeholder="e.g., Avocados"
                    className="h-12 rounded-xl bg-slate-50 dark:bg-white/5 border-none shadow-sm focus-visible:ring-brand-teal/50"
                    {...register(`items.${index}.name`)}
                  />
                </FormField>

                <FormField name={`items.${index}.category`} label="Category">
                  <Input
                    placeholder="e.g., Produce"
                    className="h-12 rounded-xl bg-slate-50 dark:bg-white/5 border-none shadow-sm focus-visible:ring-brand-teal/50"
                    {...register(`items.${index}.category`)}
                  />
                </FormField>

                <div className="grid grid-cols-2 gap-4">
                  <FormField name={`items.${index}.quantity`} label="Quantity">
                    <Input
                      type="number"
                      step="any"
                      className="h-12 rounded-xl bg-slate-50 dark:bg-white/5 border-none shadow-sm focus-visible:ring-brand-teal/50"
                      {...register(`items.${index}.quantity`, { valueAsNumber: true })}
                    />
                  </FormField>
                  <FormField name={`items.${index}.unit`} label="Unit">
                    <Input
                      placeholder="pcs"
                      className="h-12 rounded-xl bg-slate-50 dark:bg-white/5 border-none shadow-sm focus-visible:ring-brand-teal/50"
                      {...register(`items.${index}.unit`)}
                    />
                  </FormField>
                </div>

                <FormField name={`items.${index}.expiryDate`} label="Expiry Date">
                  <Input
                    type="date"
                    className="h-12 rounded-xl bg-slate-50 dark:bg-white/5 border-none shadow-sm focus-visible:ring-brand-teal/50"
                    {...register(`items.${index}.expiryDate`)}
                  />
                </FormField>
              </div>
            </div>
          ))}
        </div>

        <div className="p-10 py-8 bg-white/50 dark:bg-black/20 backdrop-blur-md border-t border-slate-200 dark:border-white/10 flex flex-col sm:flex-row gap-4">
          <Button
            type="button"
            onClick={addRow}
            variant="outline"
            className="flex-1 h-16 rounded-2xl border-2 border-brand-teal/20 text-brand-teal font-black uppercase tracking-widest hover:bg-brand-teal/5 gap-2 transition-all active:scale-95"
          >
            <Plus size={20} strokeWidth={3} />
            Add Another Item
          </Button>

          <Button
            type="submit"
            disabled={isLoading}
            className="flex-[2] h-16 rounded-2xl bg-brand-teal text-white font-black uppercase tracking-widest shadow-2xl shadow-brand-teal/30 hover:scale-[1.02] active:scale-[0.98] transition-all gap-3"
          >
            {isLoading ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
              <>
                <Save size={20} strokeWidth={3} />
                Save All {fields.length} Items
              </>
            )}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
