"use client";

import React, { useMemo } from "react";
import { Progress } from "@/components/ui/progress";
import { useBudgets } from "@/features/finance/budgets/hooks/useBudgets";
import { useTransactions } from "@/features/finance/transactions/hooks/useTransactions";
import { useDispatch } from "react-redux";
import {
  openEditBudget,
  setAddBudgetModalOpen,
} from "@/lib/store/features/finance/finance-slice";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import {
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import { useConfirm } from "@/providers/confirm-provider";
import { toast } from "sonner";
import { Budget } from "@/types/finance";

interface BudgetTrackerProps {
  compact?: boolean;
}

interface BudgetWithProgress extends Budget {
  actual: number;
  percentage: number;
  status: "safe" | "warning" | "critical";
  subBudgets?: BudgetWithProgress[];
}

function prepareBudgetUI(
  budget: Budget & { actual?: number },
): BudgetWithProgress {
  const actual = budget.actual ?? 0;

  const amount = parseFloat(budget.amount as unknown as string);
  const percentage = amount > 0 ? (actual / amount) * 100 : 0;
  const status: "safe" | "warning" | "critical" =
    percentage >= 100 ? "critical" : percentage >= 80 ? "warning" : "safe";

  return {
    ...budget,
    actual,
    percentage,
    status,
    subBudgets: budget.subBudgets?.map((sub) => prepareBudgetUI(sub)),
  };
}

export function BudgetRow({
  budget,
  isChild = false,
  selectedIds,
  onToggleSelect,
}: {
  budget: BudgetWithProgress;
  isChild?: boolean;
  selectedIds: string[];
  onToggleSelect: (id: string) => void;
}) {
  const dispatch = useDispatch();
  const { confirm } = useConfirm();
  const { deleteBudget } = useBudgets();
  const [open, setOpen] = React.useState(true);
  const hasChildren = (budget.subBudgets?.length ?? 0) > 0;
  const label = budget.name || budget.category?.name || "Budget";

  const progressColor =
    budget.status === "critical"
      ? "#F43F5E"
      : budget.status === "warning"
        ? "#F59E0B"
        : "#00A389";

  return (
    <div
      className={cn(
        "space-y-2",
        isChild && "pl-4 border-l-2 border-slate-100 dark:border-white/10 ml-2",
      )}
    >
      <div className="space-y-2">
        {/* Header row */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-1.5 min-w-0">
            <input
              type="checkbox"
              checked={selectedIds.includes(budget.id)}
              onChange={() => onToggleSelect(budget.id)}
              className="h-3.5 w-3.5 rounded border-slate-200 bg-white/50 dark:bg-white/5 text-brand-teal focus:ring-brand-teal/20 transition-all cursor-pointer mr-1"
            />
            {hasChildren ? (
              <button
                type="button"
                onClick={() => setOpen((v) => !v)}
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
                  "font-black uppercase italic tracking-tighter text-brand-teal dark:text-white leading-none truncate",
                  isChild ? "text-[11px]" : "text-[13px]",
                )}
              >
                {label}
              </p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-brand-teal-light mt-0.5">
                {budget.period}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <p
              className={cn(
                "font-black italic tracking-tighter text-brand-teal dark:text-white text-right",
                isChild ? "text-[11px]" : "text-[13px]",
              )}
            >
              $
              {budget.actual.toLocaleString(undefined, {
                maximumFractionDigits: 0,
              })}
              <span className="text-[10px] opacity-60 ml-1">
                / $
                {parseFloat(budget.amount).toLocaleString(undefined, {
                  maximumFractionDigits: 0,
                })}
              </span>
            </p>
            <button
              type="button"
              onClick={() => dispatch(openEditBudget(budget.id))}
              className="shrink-0 h-6 w-6 flex items-center justify-center rounded-lg bg-slate-100 dark:bg-white/10 text-slate-400 hover:text-brand-teal hover:bg-brand-teal/10 transition-colors"
            >
              <Pencil className="h-3 w-3" strokeWidth={2.5} />
            </button>
            <button
              type="button"
              onClick={async () => {
                const isConfirmed = await confirm({
                  title: "Delete Budget",
                  description: `Are you sure you want to delete "${label}"? This will also remove any sub-budgets. Transactions linked to this budget will remain but won't be categorized under it.`,
                  variant: "destructive",
                });
                if (isConfirmed) {
                  try {
                    await deleteBudget.mutateAsync(budget.id);
                    toast.success("Budget deleted successfully");
                  } catch (err) {
                    toast.error("Failed to delete budget");
                  }
                }
              }}
              className="shrink-0 h-6 w-6 flex items-center justify-center rounded-lg bg-slate-100 dark:bg-white/10 text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
            >
              <Trash2 className="h-3 w-3" strokeWidth={2.5} />
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <Progress
          value={Math.min(budget.percentage, 100)}
          className="h-1.5 rounded-full bg-slate-100 dark:bg-white/10"
          style={
            { "--progress-background": progressColor } as React.CSSProperties
          }
        />

        {/* Status */}
        <div className="flex items-center gap-1.5">
          {budget.status === "safe" ? (
            <CheckCircle2
              className="h-3 w-3 text-brand-emerald"
              strokeWidth={3}
            />
          ) : (
            <AlertCircle
              className={cn(
                "h-3 w-3",
                budget.status === "warning"
                  ? "text-amber-500"
                  : "text-rose-500",
              )}
              strokeWidth={3}
            />
          )}
          <p
            className={cn(
              "text-[9px] font-black uppercase tracking-widest",
              budget.status === "safe" && "text-brand-emerald",
              budget.status === "warning" && "text-amber-600",
              budget.status === "critical" && "text-rose-600",
            )}
          >
            {budget.status === "critical"
              ? "CRITICAL OVERSPEND"
              : budget.status === "warning"
                ? "LIMIT APPROACHING"
                : "SAFE ALLOCATION"}
            <span className="ml-1 opacity-70 italic">
              ({budget.percentage.toFixed(0)}%)
            </span>
          </p>
        </div>
      </div>

      {/* Sub-budgets */}
      {hasChildren && open && (
        <div className="space-y-4 pt-1">
          {budget.subBudgets!.map((sub) => (
            <BudgetRow
              key={sub.id}
              budget={sub}
              isChild
              selectedIds={selectedIds}
              onToggleSelect={onToggleSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function BudgetTracker({ compact }: BudgetTrackerProps) {
  const dispatch = useDispatch();
  const { confirm } = useConfirm();
  const { budgets, bulkDeleteBudgets } = useBudgets();
  const { transactions } = useTransactions();
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);

  const handleBulkDelete = async () => {
    const isConfirmed = await confirm({
      title: "Bulk Delete Budgets",
      description: `Are you sure you want to delete ${selectedIds.length} budgets? All associated sub-budgets will also be removed.`,
      variant: "destructive",
      confirmText: `Delete ${selectedIds.length}`,
    });

    if (isConfirmed) {
      try {
        await bulkDeleteBudgets.mutateAsync(selectedIds);
        toast.success(`${selectedIds.length} budgets removed`);
        setSelectedIds([]);
      } catch (err) {
        toast.error("Failed to delete budgets");
      }
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const budgetProgress = useMemo(() => {
    if (!budgets.data) return [];
    return budgets.data.map((b: Budget) =>
      prepareBudgetUI(b as Budget & { actual?: number }),
    );
  }, [budgets.data]);

  if (budgets.isLoading) {
    return (
      <Card className="h-[400px] flex items-center justify-center animate-pulse">
        <p className="text-muted-foreground">Loading budgets...</p>
      </Card>
    );
  }

  return (
    <Card className="h-full p-8 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-base font-black uppercase italic tracking-tighter text-brand-teal dark:text-white">
            Budget Control
          </h3>
          <p className="text-[9px] font-bold uppercase tracking-widest text-brand-teal-light dark:text-zinc-500 mt-1">
            Categorized Spending Caps
          </p>
        </div>
        <div className="flex items-center gap-2">
          {selectedIds.length > 0 && (
            <button
              type="button"
              onClick={handleBulkDelete}
              className="flex items-center gap-2 h-8 px-3 rounded-xl bg-rose-500 hover:bg-rose-600 text-white shadow-lg shadow-rose-500/20 active:scale-95 transition-all animate-in fade-in slide-in-from-right-4"
            >
              <Trash2 className="h-3.5 w-3.5" strokeWidth={2.5} />
              <span className="text-[10px] font-black uppercase tracking-widest">
                Delete {selectedIds.length}
              </span>
            </button>
          )}
          <button
            type="button"
            onClick={() => dispatch(setAddBudgetModalOpen(true))}
            className="h-8 w-8 flex items-center justify-center rounded-xl bg-brand-teal/10 text-brand-teal hover:bg-brand-teal/20 transition-colors"
            title="Add budget"
          >
            <Plus className="h-4 w-4" strokeWidth={2.5} />
          </button>
          <TrendingUp
            className="h-5 w-5 text-brand-emerald"
            strokeWidth={2.5}
          />
        </div>
      </div>

      {/* Budget list */}
      <div className="space-y-6 flex-1 overflow-y-auto custom-scrollbar">
        {budgetProgress.length > 0 ? (
          budgetProgress
            .slice(0, compact ? 4 : undefined)
            .map((budget: BudgetWithProgress) => (
              <BudgetRow
                key={budget.id}
                budget={budget}
                selectedIds={selectedIds}
                onToggleSelect={toggleSelect}
              />
            ))
        ) : (
          <div className="text-center py-8 space-y-3">
            <p className="text-sm text-slate-500">No budgets yet.</p>
            <button
              type="button"
              onClick={() => dispatch(setAddBudgetModalOpen(true))}
              className="text-xs font-bold text-brand-teal hover:underline"
            >
              + Create your first budget
            </button>
          </div>
        )}
      </div>
    </Card>
  );
}
