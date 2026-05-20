import React, { useMemo } from "react";
import { Filter, Calendar, X, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FilterType } from "../hooks/useTransactionListController";
import { AppSelect, SelectOption } from "@/components/ui/app-select";
import { useCategories } from "../../shared/hooks/useCategories";

interface TransactionFiltersProps {
  filterType: FilterType;
  onFilterTypeChange: (type: FilterType) => void;
  categoryFilter: string;
  onCategoryFilterChange: (id: string) => void;
  dateFilter: { from: string; to: string };
  onDateFilterChange: (filter: { from: string; to: string }) => void;
  selectedCount: number;
  onBulkDelete: () => void;
  onClearSelection: () => void;
}

export function TransactionFilters({
  filterType,
  onFilterTypeChange,
  categoryFilter,
  onCategoryFilterChange,
  dateFilter,
  onDateFilterChange,
  selectedCount,
  onBulkDelete,
  onClearSelection,
}: TransactionFiltersProps) {
  const FilterChip = ({ type, label }: { type: FilterType; label: string }) => (
    <button
      onClick={() => onFilterTypeChange(type)}
      className={cn(
        "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shrink-0",
        filterType === type
          ? "bg-[#c7e9e8] text-[#042727] shadow-sm"
          : "bg-slate-100 dark:bg-white/5 text-slate-450 dark:text-white/40 hover:bg-slate-200 dark:hover:bg-white/10"
      )}
    >
      {label}
    </button>
  );

  const { categories } = useCategories();

  const categoryOptions = useMemo(() => {
    const options: SelectOption[] = (categories.data || []).map((cat) => ({
      id: cat.id,
      label: cat.name,
      color: cat.color || "#ccc",
    }));
    return options;
  }, [categories.data]);

  return (
    <div className="px-8 py-6 border-none flex flex-col gap-4">
      {selectedCount > 0 && (
        <div className="flex items-center gap-2 animate-in fade-in slide-in-from-top-2 border-none pb-4">
          <span className="text-[10px] font-black uppercase text-rose-500 mr-2 tabular-nums">
            {selectedCount} Selected
          </span>
          <Button
            variant="destructive"
            size="sm"
            onClick={onBulkDelete}
            className="h-8 rounded-xl px-4 bg-rose-500 hover:bg-rose-600 text-[10px] font-black uppercase tracking-widest shadow-lg shadow-rose-500/20 active:scale-95 transition-all text-white"
          >
            Delete Selection
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearSelection}
            className="h-8 rounded-xl px-4 text-slate-400 hover:text-slate-600 dark:hover:text-white text-[10px] font-black uppercase tracking-widest"
          >
            Clear
          </Button>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-4">
        {/* Main Category/Type Filters */}
        <div className="flex items-center gap-1.5 p-1 bg-[#f2f4f5] dark:bg-white/5 rounded-2xl w-fit">
          <FilterChip type="ALL" label="All" />
          <FilterChip type="INCOME" label="Income" />
          <FilterChip type="EXPENSE" label="Expenses" />
        </div>

        {/* Category Selector */}
        <div className="min-w-[180px] relative group h-10">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-teal transition-colors z-10 pointer-events-none">
            <Tag className="h-3.5 w-3.5" />
          </span>
          <AppSelect 
             value={categoryFilter}
             onValueChange={onCategoryFilterChange}
             options={categoryOptions}
             placeholder="All Categories"
             unselectedLabel="All Categories"
             triggerClassName="h-10 bg-slate-100/50 dark:bg-white/5 rounded-2xl border-none pl-9 pr-4 text-[10px] font-black uppercase tracking-widest hover:bg-slate-200/50 transition-colors w-full ring-0 focus:ring-0"
          />
        </div>

        {/* Date Filter */}
        <div className="flex items-center relative group">
          <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 group-focus-within:text-brand-teal transition-colors" />
          <div className="flex items-center gap-1 bg-slate-100/50 dark:bg-white/5 rounded-2xl px-9 py-1 h-10 border-none">
            <input
              type="date"
              value={dateFilter.from}
              onChange={(e) => onDateFilterChange({ ...dateFilter, from: e.target.value })}
              className="bg-transparent border-none text-[10px] font-bold focus:ring-0 text-brand-teal dark:text-white/80 p-0"
            />
            <span className="text-slate-300 mx-1 text-xs">/</span>
            <input
              type="date"
              value={dateFilter.to}
              onChange={(e) => onDateFilterChange({ ...dateFilter, to: e.target.value })}
              className="bg-transparent border-none text-[10px] font-bold focus:ring-0 text-brand-teal dark:text-white/80 p-0"
            />
            {(dateFilter.from || dateFilter.to) && (
              <button
                onClick={() => onDateFilterChange({ from: "", to: "" })}
                className="ml-2 p-1 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-colors shrink-0"
              >
                <X className="h-3 w-3 text-slate-400" />
              </button>
            )}
          </div>
        </div>

        {/* Other Types (Optional/Dropdown if more types exist) */}
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5">
           <FilterChip type="BILL" label="Bills" />
           <FilterChip type="BUDGET" label="Budgets" />
           <FilterChip type="SAVING" label="Goals" />
        </div>
      </div>
    </div>
  );
}
