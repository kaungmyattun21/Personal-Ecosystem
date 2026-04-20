import React from "react";
import { ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Transaction } from "@/types/finance";
import { TransactionRow } from "./TransactionRow";
import { SortKey, SortDir } from "../hooks/useTransactionListController";

interface TransactionTableProps {
  data: Transaction[];
  sortKey: SortKey;
  sortDir: SortDir;
  onSort: (key: SortKey) => void;
  selectedIds: string[];
  onToggleSelectAll: () => void;
  onToggleSelect: (id: string) => void;
  onEdit: (tx: Transaction) => void;
  onDelete: (tx: Transaction) => void;
}

function SortIcon({
  column,
  sortKey,
  sortDir,
}: {
  column: SortKey;
  sortKey: SortKey;
  sortDir: SortDir;
}) {
  if (sortKey !== column)
    return <ChevronsUpDown className="h-3 w-3 opacity-30" />;
  return sortDir === "asc" ? (
    <ChevronUp className="h-3 w-3 text-brand-teal" />
  ) : (
    <ChevronDown className="h-3 w-3 text-brand-teal" />
  );
}

export function TransactionTable({
  data,
  sortKey,
  sortDir,
  onSort,
  selectedIds,
  onToggleSelectAll,
  onToggleSelect,
  onEdit,
  onDelete,
}: TransactionTableProps) {
  const thClass =
    "px-4 py-3 text-left text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-white/70 select-none cursor-pointer hover:text-brand-teal dark:hover:text-white transition-colors whitespace-nowrap";

  return (
    <div className="overflow-x-auto">
      {data.length > 0 ? (
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-black/[0.04] dark:border-white/[0.04] bg-slate-50/60 dark:bg-white/[0.02]">
              <th className="w-12 px-4 py-3">
                <div className="flex items-center justify-center">
                  <input
                    type="checkbox"
                    checked={data.length > 0 && selectedIds.length === data.length}
                    onChange={onToggleSelectAll}
                    className="h-4 w-4 rounded-md border-slate-200 bg-white/50 dark:bg-white/5 text-brand-teal focus:ring-brand-teal/20 transition-all cursor-pointer"
                  />
                </div>
              </th>
              <th className={thClass} onClick={() => onSort("description")}>
                <div className="flex items-center gap-1.5 ml-2">
                  Description & Context
                  <SortIcon column="description" sortKey={sortKey} sortDir={sortDir} />
                </div>
              </th>
              <th className={thClass} onClick={() => onSort("account")}>
                <div className="flex items-center gap-1.5">
                  Account
                  <SortIcon column="account" sortKey={sortKey} sortDir={sortDir} />
                </div>
              </th>
              <th className={thClass} onClick={() => onSort("date")}>
                <div className="flex items-center gap-1.5">
                  Date & Time
                  <SortIcon column="date" sortKey={sortKey} sortDir={sortDir} />
                </div>
              </th>
              <th className={cn(thClass, "text-right")} onClick={() => onSort("amount")}>
                <div className="flex items-center justify-end gap-1.5">
                  Amount
                  <SortIcon column="amount" sortKey={sortKey} sortDir={sortDir} />
                </div>
              </th>
              <th className="px-4 py-3 text-right text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-white/70 whitespace-nowrap">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((tx, i) => (
              <TransactionRow
                key={tx.id}
                tx={tx}
                isLast={i === data.length - 1}
                isSelected={selectedIds.includes(tx.id)}
                onToggleSelect={onToggleSelect}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </tbody>
        </table>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-[10px] text-slate-400 dark:text-white/20 uppercase tracking-widest">
            No records match your current filters
          </p>
        </div>
      )}
    </div>
  );
}
