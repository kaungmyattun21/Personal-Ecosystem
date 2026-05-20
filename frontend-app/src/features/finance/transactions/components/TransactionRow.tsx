import React from "react";
import { format } from "date-fns";
import {
  ArrowUpRight,
  ArrowDownLeft,
  ArrowLeftRight,
  Pencil,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Transaction } from "@/types/finance";

const TYPE_CONFIG = {
  INCOME: {
    icon: ArrowDownLeft,
    color: "text-[#006b54] dark:text-emerald-400",
    bg: "bg-[#006b54]/10",
    badge: "bg-[#006b54]/10 text-[#006b54] dark:text-emerald-400",
    sign: "+",
    amountColor: "text-[#006b54] dark:text-emerald-400",
  },
  EXPENSE: {
    icon: ArrowUpRight,
    color: "text-[#76001b] dark:text-rose-400",
    bg: "bg-[#76001b]/10",
    badge: "bg-[#76001b]/10 text-[#76001b] dark:text-rose-400",
    sign: "-",
    amountColor: "text-[#76001b] dark:text-rose-400",
  },
  TRANSFER: {
    icon: ArrowLeftRight,
    color: "text-sky-500",
    bg: "bg-sky-500/10",
    badge: "bg-sky-500/10 text-sky-600 dark:text-sky-400",
    sign: "",
    amountColor: "text-sky-600 dark:text-sky-400",
  },
};

interface TransactionRowProps {
  tx: Transaction;
  isLast: boolean;
  isSelected: boolean;
  onToggleSelect: (id: string) => void;
  onEdit: (tx: Transaction) => void;
  onDelete: (tx: Transaction) => void;
}

export function TransactionRow({
  tx,
  isLast,
  isSelected,
  onToggleSelect,
  onEdit,
  onDelete,
}: TransactionRowProps) {
  const cfg = TYPE_CONFIG[tx.type as keyof typeof TYPE_CONFIG] ?? TYPE_CONFIG.EXPENSE;
  const Icon = cfg.icon;

  return (
    <tr
      className={cn(
        "group transition-colors hover:bg-[#f2f4f5] dark:hover:bg-white/[0.02]",
        isSelected && "bg-brand-teal/[0.04] dark:bg-white/[0.04]"
      )}
    >
      {/* Checkbox */}
      <td className="px-4 py-4">
        <div className="flex items-center justify-center">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => onToggleSelect(tx.id)}
            className="h-4 w-4 rounded-md border-slate-200 bg-white/50 dark:bg-white/5 text-brand-teal focus:ring-brand-teal/20 transition-all cursor-pointer"
          />
        </div>
      </td>
      {/* Description */}
      <td className="px-4 py-4">
        <div className="flex items-center gap-4">
          <div
            className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl transition-all group-hover:scale-110 group-hover:rotate-6 shadow-sm",
              cfg.bg,
              cfg.color,
            )}
          >
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="text-[13px] font-bold text-slate-900 dark:text-white leading-tight">
                {tx.description || tx.category?.name || "Untitled Transaction"}
              </p>
              {tx.billId && (
                <span className="px-1.5 py-0.5 rounded-md bg-amber-500/10 text-amber-600 text-[8px] font-black uppercase tracking-tighter">
                  Bill
                </span>
              )}
              {tx.budgetId && (
                <span className="px-1.5 py-0.5 rounded-md bg-brand-teal/10 text-brand-teal text-[8px] font-black uppercase tracking-tighter">
                  Budget
                </span>
              )}
              {tx.savingGoalId && (
                <span className="px-1.5 py-0.5 rounded-md bg-sky-500/10 text-sky-600 text-[8px] font-black uppercase tracking-tighter">
                  Goal
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 mt-1">
              {tx.category?.name && (
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                  {tx.category.name}
                </p>
              )}
              {tx.type === "INCOME" && (
                <span className="h-1 w-1 rounded-full bg-emerald-500/30" />
              )}
              {tx.type === "INCOME" && (
                <p className="text-[10px] font-bold text-emerald-700 uppercase italic">
                  External
                </p>
              )}
            </div>
          </div>
        </div>
      </td>

      {/* Account */}
      <td className="px-4 py-4">
        <div className="flex flex-col">
          <span className="text-[11px] font-black text-slate-700 dark:text-white/70 uppercase tracking-tight">
            {tx.account?.name ?? "Default Account"}
          </span>
          <span className="text-[9px] font-bold text-slate-500 dark:text-white/40 uppercase tracking-widest mt-0.5">
            ID: {tx.account?.id.slice(-4) ?? "----"}
          </span>
        </div>
      </td>

      {/* Date & Time */}
      <td className="px-4 py-4">
        <div className="flex flex-col">
          <span className="text-[11px] font-bold text-slate-700 dark:text-white/80 tabular-nums">
            {format(new Date(tx.date), "MMM dd, yyyy")}
          </span>
          <span className="text-[10px] font-medium text-slate-500 dark:text-white/60 tabular-nums uppercase mt-0.5">
            {format(new Date(tx.date), "HH:mm:ss a")}
          </span>
        </div>
      </td>

      {/* Amount */}
      <td className="px-4 py-4 text-right">
        <div className="flex flex-col items-end">
          <span
            className={cn(
              "text-[14px] font-black tabular-nums",
              cfg.amountColor,
            )}
          >
            {cfg.sign}${Math.abs(parseFloat(tx.amount)).toLocaleString(
              undefined,
              { minimumFractionDigits: 2 },
            )}
          </span>
          <span className="text-[8px] font-black uppercase tracking-widest text-slate-600 dark:text-white/60 mt-0.5">
            Currency: USD
          </span>
        </div>
      </td>

      {/* Actions */}
      <td className="px-4 py-4">
        <div className="flex items-center justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-xl hover:bg-brand-teal/10 hover:text-brand-teal text-slate-400 transition-colors"
            title="Edit transaction"
            onClick={() => onEdit(tx)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-xl hover:bg-rose-500/10 hover:text-rose-500 text-slate-400 transition-colors"
            title="Delete transaction"
            onClick={() => onDelete(tx)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </td>
    </tr>
  );
}
