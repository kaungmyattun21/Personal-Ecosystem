"use client";

import React from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { FormField } from "@/components/ui/form-field";
import { AppSelect, SelectOption } from "@/components/ui/app-select";
import { Account } from "@/types/finance";
import { TransactionFormValues } from "../transactionFormSchema";

import { Wallet } from "lucide-react";

export function AccountSelector({ accounts }: { accounts: Account[] }) {
  const { control, setValue } = useFormContext<TransactionFormValues>();
  const selectedAccountId = useWatch({ control, name: "accountId" });

  if (!accounts || accounts.length === 0) return null;

  const options: SelectOption[] = accounts.map((account) => ({
    id: account.id,
    label: account.name,
  }));

  return (
    <FormField name="accountId" label="Account">
      <div className="relative group">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900 dark:group-focus-within:text-white transition-colors z-10">
          <Wallet className="h-5 w-5" strokeWidth={2} />
        </span>
        <AppSelect
          value={selectedAccountId || ""}
          onValueChange={(val) => setValue("accountId", val)}
          options={options}
          placeholder="Select account"
          triggerClassName="h-14 bg-slate-50 dark:bg-white/5 border-none rounded-2xl pl-12 text-base font-medium text-slate-900 dark:text-white focus:ring-1 focus:ring-slate-200"
        />
      </div>
    </FormField>
  );
}
