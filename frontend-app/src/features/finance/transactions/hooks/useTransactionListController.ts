import { useState, useMemo } from "react";
import { useDispatch } from "react-redux";
import { openEditTransaction } from "@/lib/store/features/finance/finance-slice";
import { Transaction } from "@/types/finance";
import { useConfirm } from "@/providers/confirm-provider";
import { toast } from "sonner";
import { useTransactions } from "./useTransactions";

export type SortKey = "description" | "account" | "date" | "amount" | "type";
export type SortDir = "asc" | "desc";
export type FilterType = "ALL" | "INCOME" | "EXPENSE" | "BILL" | "BUDGET" | "UNBUDGETED" | "SAVING";

interface UseTransactionListOptions {
  limit?: number;
}

export function useTransactionListController(options: UseTransactionListOptions = {}) {
  const { limit } = options;

  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<FilterType>("ALL");
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [dateFilter, setDateFilter] = useState<{ from: string; to: string }>({
    from: "",
    to: "",
  });

  const filters = useMemo(() => ({
    search,
    type: filterType,
    categoryId: categoryFilter,
    fromDate: dateFilter.from,
    toDate: dateFilter.to
  }), [search, filterType, categoryFilter, dateFilter]);

  const { transactions, deleteTransaction, bulkDeleteTransactions } = useTransactions(filters);
  const dispatch = useDispatch();
  const { confirm } = useConfirm();

  const [sortKey, setSortKey] = useState<SortKey>("date");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d: SortDir) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  };

  const handleEdit = (tx: Transaction) => {
    dispatch(openEditTransaction(tx.id));
  };

  const handleDelete = async (tx: Transaction) => {
    const isConfirmed = await confirm({
      title: "Confirm Deletion",
      description: `Are you sure you want to remove "${tx.description || tx.category?.name}"? This will reverse any related balance updates.`,
      confirmText: "Confirm",
      variant: "destructive",
    });

    if (isConfirmed) {
      try {
        await deleteTransaction.mutateAsync(tx.id);
        toast.success("Transaction deleted successfully");
        setSelectedIds(prev => prev.filter(id => id !== tx.id));
      } catch (error) {
        toast.error("Failed to delete transaction");
      }
    }
  };

  const handleBulkDelete = async () => {
    const isConfirmed = await confirm({
      title: "Bulk Deletion",
      description: `Are you sure you want to delete ${selectedIds.length} selected transactions? This action will reverse all related balance updates and cannot be undone.`,
      confirmText: `Delete ${selectedIds.length} Records`,
      variant: "destructive",
    });

    if (isConfirmed) {
      try {
        await bulkDeleteTransactions.mutateAsync(selectedIds);
        toast.success(`${selectedIds.length} transactions deleted successfully`);
        setSelectedIds([]);
      } catch (error) {
        toast.error("Failed to delete transactions");
      }
    }
  };

  const toggleSelectAll = (ids: string[]) => {
    if (selectedIds.length === ids.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(ids);
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const filteredAndSortedData = useMemo(() => {
    let list: Transaction[] = transactions.data ?? [];

    // Client-side Sort (Keep for now as backend filtering is implemented)
    list = [...list].sort((a, b) => {
      let aVal: string | number = "";
      let bVal: string | number = "";
      if (sortKey === "date") {
        aVal = new Date(a.date).getTime();
        bVal = new Date(b.date).getTime();
      } else if (sortKey === "amount") {
        aVal = parseFloat(a.amount);
        bVal = parseFloat(b.amount);
      } else if (sortKey === "description") {
        aVal = (a.description || a.category?.name || "").toLowerCase();
        bVal = (b.description || b.category?.name || "").toLowerCase();
      } else if (sortKey === "account") {
        aVal = (a.account?.name ?? "").toLowerCase();
        bVal = (b.account?.name ?? "").toLowerCase();
      } else if (sortKey === "type") {
        aVal = a.type;
        bVal = b.type;
      }
      if (aVal < bVal) return sortDir === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDir === "asc" ? 1 : -1;
      return 0;
    });

    return limit ? list.slice(0, limit) : list;
  }, [transactions.data, sortKey, sortDir, limit]);

  return {
    data: filteredAndSortedData,
    isLoading: transactions.isLoading,
    search,
    setSearch,
    filterType,
    setFilterType,
    categoryFilter,
    setCategoryFilter,
    dateFilter,
    setDateFilter,
    sortKey,
    sortDir,
    handleSort,
    handleEdit,
    handleDelete,
    handleBulkDelete,
    selectedIds,
    setSelectedIds,
    toggleSelectAll: () => toggleSelectAll(filteredAndSortedData.map(tx => tx.id)),
    toggleSelect,
  };
}
