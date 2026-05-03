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
      <form onSubmit={onSubmit} className="flex flex-col gap-6 p-6">
        <div className="max-h-[60vh] overflow-y-auto pr-2 space-y-4">
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="group relative flex flex-col gap-4 p-5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 transition-all hover:bg-slate-100 dark:hover:bg-white/10"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-brand-teal bg-brand-teal/10 px-3 py-1 rounded-full">
                  Item #{index + 1}
                </span>
                {fields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeRow(index)}
                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <FormField name={`items.${index}.name`} label="Name">
                  <Input
                    placeholder="Item name"
                    className="h-10 rounded-xl bg-white dark:bg-zinc-900 border-none shadow-sm"
                    {...register(`items.${index}.name`)}
                  />
                </FormField>

                <FormField name={`items.${index}.category`} label="Category">
                  <Input
                    placeholder="Category"
                    className="h-10 rounded-xl bg-white dark:bg-zinc-900 border-none shadow-sm"
                    {...register(`items.${index}.category`)}
                  />
                </FormField>

                <div className="grid grid-cols-2 gap-2">
                  <FormField name={`items.${index}.quantity`} label="Qty">
                    <Input
                      type="number"
                      step="any"
                      className="h-10 rounded-xl bg-white dark:bg-zinc-900 border-none shadow-sm"
                      {...register(`items.${index}.quantity`, { valueAsNumber: true })}
                    />
                  </FormField>
                  <FormField name={`items.${index}.unit`} label="Unit">
                    <Input
                      placeholder="unit"
                      className="h-10 rounded-xl bg-white dark:bg-zinc-900 border-none shadow-sm"
                      {...register(`items.${index}.unit`)}
                    />
                  </FormField>
                </div>

                <FormField name={`items.${index}.expiryDate`} label="Expiry">
                  <Input
                    type="date"
                    className="h-10 rounded-xl bg-white dark:bg-zinc-900 border-none shadow-sm"
                    {...register(`items.${index}.expiryDate`)}
                  />
                </FormField>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-slate-100 dark:border-white/10">
          <Button
            type="button"
            onClick={addRow}
            variant="outline"
            className="flex-1 h-14 rounded-2xl border-2 border-brand-teal/20 text-brand-teal font-black uppercase tracking-widest hover:bg-brand-teal/5 gap-2"
          >
            <Plus size={18} strokeWidth={2.5} />
            Add Another Row
          </Button>

          <Button
            type="submit"
            disabled={isLoading}
            className="flex-[2] h-14 rounded-2xl bg-brand-teal text-white font-black uppercase tracking-widest shadow-xl shadow-brand-teal/20 hover:scale-[1.02] active:scale-[0.98] transition-all gap-3"
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                <Save size={18} strokeWidth={2.5} />
                Save All Items
              </>
            )}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
