import { Plus, TrendingUp, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { BudgetTrackerContext } from "../hooks/useBudgetTrackerController";
import { BudgetRow } from "../components/BudgetRow";
import { BudgetTrackerSkeleton } from "../components/BudgetTrackerSkeleton";
import { DataLoadError } from "@/features/finance/shared/components/DataLoadError";

interface BudgetTrackerViewProps extends BudgetTrackerContext {
  compact?: boolean;
}

const COMPACT_LIMIT = 4;

export function BudgetTrackerView({
  budgets,
  isLoading,
  isError,
  selectedIds,
  onToggleSelect,
  onAddBudget,
  onEditBudget,
  onDeleteBudget,
  onBulkDelete,
  compact,
}: BudgetTrackerViewProps) {
  if (isLoading) return <BudgetTrackerSkeleton />;
  if (isError) return <DataLoadError message="Couldn't load your budgets." />;

  const visibleBudgets = compact ? budgets.slice(0, COMPACT_LIMIT) : budgets;

  return (
    <Card className="h-full p-8 flex flex-col border-none bg-white dark:bg-zinc-900/50 shadow-[0_12px_32px_-4px_rgba(4,39,39,0.04)] rounded-[24px]">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-base font-extrabold font-display uppercase tracking-tighter text-[#042727] dark:text-white">
            Budget Control
          </h3>
          <p className="text-[9px] font-bold uppercase tracking-widest text-[#042727]/60 dark:text-zinc-500 mt-1">
            Categorized Spending Caps
          </p>
        </div>
        <div className="flex items-center gap-2">
          {selectedIds.length > 0 && (
            <button
              type="button"
              onClick={onBulkDelete}
              className="flex items-center gap-2 h-8 px-3 rounded-full bg-[#ef4444] hover:bg-[#ef4444]/90 text-white shadow-lg active:scale-95 transition-all animate-in fade-in slide-in-from-right-4"
            >
              <Trash2 className="h-3.5 w-3.5" strokeWidth={2.5} />
              <span className="text-[9px] font-black uppercase tracking-widest">
                Delete {selectedIds.length}
              </span>
            </button>
          )}
          <button
            type="button"
            onClick={onAddBudget}
            className="h-8 w-8 flex items-center justify-center rounded-full bg-[#f2f4f5] dark:bg-white/5 text-[#10b981] hover:bg-[#10b981] hover:text-white transition-all cursor-pointer"
            title="Add budget"
          >
            <Plus className="h-4 w-4" strokeWidth={2.5} />
          </button>
          <TrendingUp className="h-5 w-5 text-[#10b981]" strokeWidth={2.5} />
        </div>
      </div>

      <div className="space-y-6 flex-1 overflow-y-auto custom-scrollbar">
        {visibleBudgets.length > 0 ? (
          visibleBudgets.map((budget) => (
            <BudgetRow
              key={budget.id}
              budget={budget}
              selectedIds={selectedIds}
              onToggleSelect={onToggleSelect}
              onEdit={onEditBudget}
              onDelete={onDeleteBudget}
            />
          ))
        ) : (
          <div className="text-center py-8 space-y-3">
            <p className="text-sm text-slate-500">No budgets yet.</p>
            <button
              type="button"
              onClick={onAddBudget}
              className="text-xs font-bold text-[#10b981] hover:underline"
            >
              + Create your first budget
            </button>
          </div>
        )}
      </div>
    </Card>
  );
}
