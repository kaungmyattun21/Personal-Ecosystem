import React, { useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Pencil,
  Trash2,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import {
  budgetLabel,
  BudgetStatus,
  BudgetWithProgress,
} from "../deriveBudgetProgress";

interface BudgetRowProps {
  budget: BudgetWithProgress;
  isChild?: boolean;
  selectedIds: string[];
  onToggleSelect: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (budget: BudgetWithProgress) => void;
}

const STATUS_COLOR: Record<BudgetStatus, string> = {
  safe: "#10b981",
  warning: "#d39a3e",
  critical: "#ef4444",
};

const STATUS_TEXT: Record<BudgetStatus, string> = {
  safe: "SAFE ALLOCATION",
  warning: "LIMIT APPROACHING",
  critical: "CRITICAL OVERSPEND",
};

const STATUS_CLASS: Record<BudgetStatus, string> = {
  safe: "text-[#10b981]",
  warning: "text-[#d39a3e]",
  critical: "text-[#ef4444]",
};

function currency(value: number) {
  return value.toLocaleString(undefined, { maximumFractionDigits: 0 });
}

export function BudgetRow({
  budget,
  isChild = false,
  selectedIds,
  onToggleSelect,
  onEdit,
  onDelete,
}: BudgetRowProps) {
  const [open, setOpen] = useState(true);
  const hasChildren = (budget.subBudgets?.length ?? 0) > 0;
  const label = budgetLabel(budget);

  return (
    <div
      className={cn(
        "space-y-2",
        isChild && "pl-4 border-l border-zinc-150/15 dark:border-white/5 ml-2",
      )}
    >
      <div className="space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-1.5 min-w-0">
            <input
              type="checkbox"
              checked={selectedIds.includes(budget.id)}
              onChange={() => onToggleSelect(budget.id)}
              className="h-3.5 w-3.5 rounded border-[#042727]/20 bg-white/50 dark:bg-white/5 text-[#10b981] focus:ring-[#10b981]/20 transition-all cursor-pointer mr-1"
            />
            {hasChildren ? (
              <button
                type="button"
                onClick={() => setOpen((value) => !value)}
                className="shrink-0 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
              >
                {open ? (
                  <ChevronDown className="h-3.5 w-3.5" strokeWidth={2.5} />
                ) : (
                  <ChevronRight className="h-3.5 w-3.5" strokeWidth={2.5} />
                )}
              </button>
            ) : (
              <span className="w-3.5 shrink-0" />
            )}
            <div className="min-w-0">
              <p
                className={cn(
                  "font-black uppercase tracking-tighter text-[#042727] dark:text-white leading-none truncate",
                  isChild ? "text-[11px]" : "text-[13px]",
                )}
              >
                {label}
              </p>
              <p className="text-[9px] font-bold uppercase tracking-widest text-[#042727]/60 dark:text-zinc-500 mt-0.5">
                {budget.period}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <p
              className={cn(
                "font-black tracking-tighter text-[#042727] dark:text-white text-right",
                isChild ? "text-[11px]" : "text-[13px]",
              )}
            >
              ${currency(budget.actual)}
              <span className="text-[10px] opacity-60 ml-1">
                / ${currency(parseFloat(budget.amount))}
              </span>
            </p>
            <button
              type="button"
              onClick={() => onEdit(budget.id)}
              className="shrink-0 h-6 w-6 flex items-center justify-center rounded-lg bg-[#f2f4f5] dark:bg-white/5 text-slate-400 hover:text-[#10b981] hover:bg-[#10b981]/10 transition-colors"
            >
              <Pencil className="h-3 w-3" strokeWidth={2.5} />
            </button>
            <button
              type="button"
              onClick={() => onDelete(budget)}
              className="shrink-0 h-6 w-6 flex items-center justify-center rounded-lg bg-[#f2f4f5] dark:bg-white/5 text-slate-400 hover:text-[#ef4444] hover:bg-[#ef4444]/10 transition-colors"
            >
              <Trash2 className="h-3 w-3" strokeWidth={2.5} />
            </button>
          </div>
        </div>

        <Progress
          value={Math.min(budget.percentage, 100)}
          className="h-1.5 rounded-full bg-[#f2f4f5] dark:bg-white/5"
          style={
            {
              "--progress-background": STATUS_COLOR[budget.status],
            } as React.CSSProperties
          }
        />

        <div className="flex items-center gap-1.5">
          {budget.status === "safe" ? (
            <CheckCircle2 className="h-3 w-3 text-[#10b981]" strokeWidth={3} />
          ) : (
            <AlertCircle
              className={cn("h-3 w-3", STATUS_CLASS[budget.status])}
              strokeWidth={3}
            />
          )}
          <p
            className={cn(
              "text-[9px] font-black uppercase tracking-widest",
              STATUS_CLASS[budget.status],
            )}
          >
            {STATUS_TEXT[budget.status]}
            <span className="ml-1 opacity-70 italic">
              ({budget.percentage.toFixed(0)}%)
            </span>
          </p>
        </div>
      </div>

      {hasChildren && open && (
        <div className="space-y-4 pt-1">
          {budget.subBudgets!.map((sub) => (
            <BudgetRow
              key={sub.id}
              budget={sub}
              isChild
              selectedIds={selectedIds}
              onToggleSelect={onToggleSelect}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
