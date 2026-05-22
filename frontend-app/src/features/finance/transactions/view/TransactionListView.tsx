import React from "react";
import { Activity, Search, Download, ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
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
      <div className="space-y-8 animate-pulse">
        <div className="flex items-center justify-between">
          <div className="h-6 w-48 rounded bg-slate-200 dark:bg-white/10" />
          <div className="h-10 w-32 rounded bg-slate-200 dark:bg-white/10" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 rounded-[24px] bg-slate-200 dark:bg-white/10" />
          ))}
        </div>
        <Card className="overflow-hidden p-0 border-none rounded-[24px]">
          <div className="p-6">
            <div className="h-5 w-40 rounded-full bg-slate-200 dark:bg-white/10" />
          </div>
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center gap-4 px-6 py-4 border-t border-zinc-100 dark:border-white/5">
              <div className="h-9 w-9 rounded-xl bg-slate-200 dark:bg-white/10 shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-32 rounded-full bg-slate-200 dark:bg-white/10" />
                <div className="h-2 w-20 rounded-full bg-slate-100 dark:bg-white/5" />
              </div>
              <div className="h-4 w-20 rounded-full bg-slate-200 dark:bg-white/10" />
            </div>
          ))}
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 font-sans">

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-extrabold font-display uppercase tracking-tighter text-[#042727] dark:text-white">
            {title || "Activity Journal"}
          </h2>
          <p className="text-[9px] font-bold uppercase tracking-widest text-[#042727]/60 dark:text-zinc-500 mt-1">
            Showing {ctrl.data.length} records matching current filters
          </p>
        </div>

        {!limit && (
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto md:justify-end">
            <div className="relative group max-w-xs w-full min-w-[200px]">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400 group-focus-within:text-[#042727] transition-colors" />
              <Input
                placeholder="Search history..."
                value={ctrl.search}
                onChange={(e) => ctrl.setSearch(e.target.value)}
                className="h-10 w-full rounded-full border-none bg-white dark:bg-zinc-900/50 shadow-sm pl-10 text-[11px] font-medium focus-visible:ring-[#042727]/20 transition-all"
              />
            </div>

            <Button
              onClick={ctrl.handleExportCSV}
              disabled={ctrl.data.length === 0}
              className="h-10 rounded-full px-5 bg-gradient-to-br from-[#042727] to-[#1d3d3d] hover:to-[#042727] text-white text-[10px] font-black uppercase tracking-widest shadow-[0_8px_20px_rgba(4,39,39,0.15)] active:scale-95 transition-all flex items-center gap-2 border-none"
            >
              <Download size={14} strokeWidth={2.5} />
              Export CSV
            </Button>
          </div>
        )}
      </div>

      {/* Summary Metric Cards */}
      {!limit && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-8 border-none bg-white dark:bg-zinc-900/50 shadow-[0_12px_32px_-4px_rgba(4,39,39,0.04)] rounded-[24px] flex flex-col justify-between min-h-[140px] transition-all hover:scale-[1.01]">
            <div className="flex items-center justify-between">
              <span className="text-[8.5px] font-black uppercase tracking-[0.25em] text-[#042727]/60 dark:text-zinc-500">
                Filtered Inflow
              </span>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#10b981]/10 text-[#10b981]">
                <ArrowDownLeft size={18} strokeWidth={2.5} />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-[26px] font-black tracking-tighter text-[#10b981] dark:text-emerald-400 font-display leading-none block">
                +${ctrl.totalInflow.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <span className="text-[8px] font-bold uppercase tracking-wider text-[#042727]/40 dark:text-zinc-600 mt-1 block">
                Total income in period
              </span>
            </div>
          </Card>

          <Card className="p-8 border-none bg-white dark:bg-zinc-900/50 shadow-[0_12px_32px_-4px_rgba(4,39,39,0.04)] rounded-[24px] flex flex-col justify-between min-h-[140px] transition-all hover:scale-[1.01]">
            <div className="flex items-center justify-between">
              <span className="text-[8.5px] font-black uppercase tracking-[0.25em] text-[#042727]/60 dark:text-zinc-500">
                Filtered Outflow
              </span>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#ef4444]/10 text-[#ef4444]">
                <ArrowUpRight size={18} strokeWidth={2.5} />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-[26px] font-black tracking-tighter text-[#ef4444] dark:text-rose-400 font-display leading-none block">
                -${ctrl.totalOutflow.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <span className="text-[8px] font-bold uppercase tracking-wider text-[#042727]/40 dark:text-zinc-600 mt-1 block">
                Total expenses in period
              </span>
            </div>
          </Card>

          <Card className="p-8 border-none bg-white dark:bg-zinc-900/50 shadow-[0_12px_32px_-4px_rgba(4,39,39,0.04)] rounded-[24px] flex flex-col justify-between min-h-[140px] transition-all hover:scale-[1.01]">
            <div className="flex items-center justify-between">
              <span className="text-[8.5px] font-black uppercase tracking-[0.25em] text-[#042727]/60 dark:text-zinc-500">
                Net Period Balance
              </span>
              <div className={cn(
                "flex h-9 w-9 items-center justify-center rounded-xl",
                ctrl.netBalance >= 0 ? "bg-[#10b981]/10 text-[#10b981]" : "bg-[#ef4444]/10 text-[#ef4444]"
              )}>
                <Activity size={18} strokeWidth={2.5} />
              </div>
            </div>
            <div className="mt-4">
              <span className={cn(
                "text-[26px] font-black tracking-tighter font-display leading-none block",
                ctrl.netBalance >= 0 ? "text-[#10b981] dark:text-emerald-400" : "text-[#ef4444] dark:text-rose-400"
              )}>
                {ctrl.netBalance >= 0 ? "+" : ""}${ctrl.netBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <span className="text-[8px] font-bold uppercase tracking-wider text-[#042727]/40 dark:text-zinc-600 mt-1 block">
                Net difference in period
              </span>
            </div>
          </Card>
        </div>
      )}

      {/* Filters + Table Card */}
      <Card className="overflow-hidden border-none shadow-[0_12px_32px_-4px_rgba(4,39,39,0.04)] bg-white dark:bg-zinc-900/50 rounded-[24px] p-0">
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
            <div className="h-16 w-16 rounded-[24px] bg-[#042727]/5 flex items-center justify-center mb-4 transition-transform hover:scale-110">
              <Activity className="h-8 w-8 text-[#042727] opacity-20" />
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
    </div>
  );
}
