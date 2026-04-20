import React from "react";
import { Activity, Search } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { TransactionFilters } from "../components/TransactionFilters";
import { TransactionTable } from "../components/TransactionTable";
import { useTransactionListController } from "../hooks/useTransactionListController";

interface TransactionListViewProps {
  limit?: number;
  title?: string;
}

export function TransactionListView({ limit, title }: TransactionListViewProps) {
  const ctrl = useTransactionListController({ limit });

  if (ctrl.isLoading) {
    return (
      <Card className="overflow-hidden animate-pulse p-0">
        <div className="p-6 border-b border-black/[0.03] dark:border-white/[0.03]">
          <div className="h-5 w-40 rounded-full bg-slate-200 dark:bg-white/10" />
        </div>
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-4 px-6 py-4 border-b border-black/[0.03] dark:border-white/[0.03]"
          >
            <div className="h-9 w-9 rounded-xl bg-slate-200 dark:bg-white/10 shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-3 w-32 rounded-full bg-slate-200 dark:bg-white/10" />
              <div className="h-2 w-20 rounded-full bg-slate-100 dark:bg-white/5" />
            </div>
            <div className="h-4 w-20 rounded-full bg-slate-200 dark:bg-white/10" />
          </div>
        ))}
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden p-0">
      {/* Header */}
      <div className="px-6 py-5 border-b border-black/[0.03] dark:border-white/[0.03] flex items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-black uppercase italic tracking-tighter text-brand-teal dark:text-white">
            {title || "Transactions Dashboard"}
          </h3>
          <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mt-0.5">
            Showing {ctrl.data.length} records
          </p>
        </div>

        {!limit && (
           <div className="relative group max-w-xs w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 group-focus-within:text-brand-teal transition-colors" />
            <Input 
              placeholder="Search history..." 
              value={ctrl.search}
              onChange={(e) => ctrl.setSearch(e.target.value)}
              className="h-9 w-full rounded-xl border-none bg-slate-100/50 dark:bg-white/5 pl-9 text-[11px] font-medium focus-visible:ring-brand-teal/2 transition-all shadow-sm"
            />
          </div>
        )}
      </div>

      {!limit && (
        <TransactionFilters
          filterType={ctrl.filterType}
          onFilterTypeChange={ctrl.setFilterType}
          categoryFilter={ctrl.categoryFilter}
          onCategoryFilterChange={ctrl.setCategoryFilter}
          dateFilter={ctrl.dateFilter}
          onDateFilterChange={ctrl.setDateFilter}
          selectedCount={ctrl.selectedIds.length}
          onBulkDelete={ctrl.handleBulkDelete}
          onClearSelection={() => ctrl.setSelectedIds([])}
        />
      )}

      {ctrl.data.length > 0 ? (
        <TransactionTable
          data={ctrl.data}
          sortKey={ctrl.sortKey}
          sortDir={ctrl.sortDir}
          onSort={ctrl.handleSort}
          selectedIds={ctrl.selectedIds}
          onToggleSelectAll={ctrl.toggleSelectAll}
          onToggleSelect={ctrl.toggleSelect}
          onEdit={ctrl.handleEdit}
          onDelete={ctrl.handleDelete}
        />
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="h-16 w-16 rounded-[24px] bg-brand-teal/5 flex items-center justify-center mb-4 transition-transform hover:scale-110">
            <Activity className="h-8 w-8 text-brand-teal opacity-20" />
          </div>
          <p className="text-[12px] font-black uppercase tracking-[0.2em] text-slate-500 mb-1">
            Zero Records Found
          </p>
          <p className="text-[10px] text-slate-400 dark:text-white/20 uppercase tracking-widest">
            {ctrl.search || ctrl.filterType !== "ALL" || ctrl.dateFilter.from
              ? "Refine your filters to see results"
              : "Start documenting your finance journey"}
          </p>
        </div>
      )}
    </Card>
  );
}
