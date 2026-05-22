"use client";

import React from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { cn } from "@/lib/utils";
import { Building2, CreditCard, Wallet, PiggyBank } from "lucide-react";
import { Account, AccountType } from "@/types/finance";
import { TransactionFormValues } from "../transactionFormSchema";

const ACCOUNT_ICONS: Record<AccountType, React.ReactNode> = {
  CHECKING: <Building2 className="h-4 w-4" strokeWidth={2} />,
  SAVINGS: <PiggyBank className="h-4 w-4" strokeWidth={2} />,
  CREDIT: <CreditCard className="h-4 w-4" strokeWidth={2} />,
  CASH: <Wallet className="h-4 w-4" strokeWidth={2} />,
  OTHER: <Wallet className="h-4 w-4" strokeWidth={2} />,
};

export function AccountSelectorCards({ accounts }: { accounts: Account[] }) {
  const { control, setValue } = useFormContext<TransactionFormValues>();
  const selectedAccountId = useWatch({ control, name: "accountId" });

  if (!accounts || accounts.length === 0) return null;

  return (
    <div className="space-y-2">
      <span className="text-[11px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
        Source Account
      </span>
      <div className="space-y-2">
        {accounts.map((account) => {
          const isSelected = selectedAccountId === account.id;
          const last4 = account.name.replace(/\D/g, "").slice(-4) || "——";
          return (
            <button
              key={account.id}
              type="button"
              onClick={() => setValue("accountId", account.id, { shouldValidate: true })}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl border transition-all text-left",
                isSelected
                  ? "border-brand-emerald bg-brand-emerald/5 dark:bg-brand-emerald/10"
                  : "border-slate-200 dark:border-white/8 bg-white dark:bg-white/4 hover:border-slate-300 dark:hover:border-white/15",
              )}
            >
              {/* Radio dot */}
              <span
                className={cn(
                  "flex items-center justify-center w-4 h-4 rounded-full border-2 shrink-0 transition-colors",
                  isSelected
                    ? "border-brand-emerald"
                    : "border-slate-300 dark:border-white/20",
                )}
              >
                {isSelected && (
                  <span className="w-2 h-2 rounded-full bg-brand-emerald" />
                )}
              </span>

              {/* Account info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                  {account.name}
                </p>
                <p className="text-xs text-slate-400 dark:text-slate-500">
                  •••• {last4}
                </p>
              </div>

              {/* Account type icon */}
              <span className="text-slate-400 dark:text-slate-500 shrink-0">
                {ACCOUNT_ICONS[account.type] ?? ACCOUNT_ICONS.OTHER}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
