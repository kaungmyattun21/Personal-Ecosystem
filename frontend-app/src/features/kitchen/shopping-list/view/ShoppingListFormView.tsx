"use client";

import React from "react";
import * as RHF from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Save } from "lucide-react";
import { FormField } from "@/components/ui/form-field";
import { AppSelect } from "@/components/ui/app-select";

const FormProvider = (RHF as any).FormProvider;

interface ShoppingListFormViewProps {
  form: any;
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  isLoading: boolean;
  isEditMode: boolean;
}

export function ShoppingListFormView({
  form,
  onSubmit,
  isLoading,
  isEditMode,
}: ShoppingListFormViewProps) {
  const { register, setValue, watch } = form;
  const statusValue = watch("status");

  return (
    <FormProvider {...form}>
      <form onSubmit={onSubmit} className="flex flex-col gap-6 p-10 pt-4">
        <div className="space-y-4">
          <FormField name="name" label="List Name">
            <Input
              placeholder="e.g., Weekly Groceries"
              className="h-12 rounded-xl bg-slate-50 dark:bg-white/5 border-none"
              {...register("name")}
            />
          </FormField>

          <FormField name="status" label="Status">
            <AppSelect
              value={statusValue}
              onValueChange={(val) => setValue("status", val)}
              placeholder="Select status"
              options={[
                { id: "ACTIVE", label: "Active" },
                { id: "ARCHIVED", label: "Archived" },
              ]}
              unselectedLabel="Select Status"
            />
          </FormField>
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
              {isEditMode ? "Update List" : "Create List"}
            </>
          )}
        </Button>
      </form>
    </FormProvider>
  );
}
