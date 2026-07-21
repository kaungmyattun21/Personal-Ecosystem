"use client";

import { useCallback, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import {
  openEditBudget,
  setAddBudgetModalOpen,
} from "@/lib/store/features/finance/finance-slice";
import { useConfirm } from "@/providers/confirm-provider";
import { useBudgets } from "./useBudgets";
import {
  budgetLabel,
  BudgetWithProgress,
  toBudgetProgress,
} from "../deriveBudgetProgress";

export interface BudgetTrackerContext {
  budgets: BudgetWithProgress[];
  isLoading: boolean;
  selectedIds: string[];
  onToggleSelect: (id: string) => void;
  onAddBudget: () => void;
  onEditBudget: (id: string) => void;
  onDeleteBudget: (budget: BudgetWithProgress) => Promise<void>;
  onBulkDelete: () => Promise<void>;
}

export function useBudgetTrackerController(): BudgetTrackerContext {
  const dispatch = useDispatch();
  const { confirm } = useConfirm();
  const { budgets, deleteBudget, bulkDeleteBudgets } = useBudgets();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const budgetProgress = useMemo(
    () => (budgets.data ?? []).map(toBudgetProgress),
    [budgets.data],
  );

  const onToggleSelect = useCallback((id: string) => {
    setSelectedIds((previous) =>
      previous.includes(id)
        ? previous.filter((selected) => selected !== id)
        : [...previous, id],
    );
  }, []);

  const onAddBudget = useCallback(() => {
    dispatch(setAddBudgetModalOpen(true));
  }, [dispatch]);

  const onEditBudget = useCallback(
    (id: string) => {
      dispatch(openEditBudget(id));
    },
    [dispatch],
  );

  const onDeleteBudget = useCallback(
    async (budget: BudgetWithProgress) => {
      const isConfirmed = await confirm({
        title: "Delete Budget",
        description: `Are you sure you want to delete "${budgetLabel(budget)}"? This will also remove any sub-budgets. Transactions linked to this budget will remain but won't be categorized under it.`,
        variant: "destructive",
      });

      if (!isConfirmed) return;

      try {
        await deleteBudget.mutateAsync(budget.id);
        toast.success("Budget deleted successfully");
      } catch {
        toast.error("Failed to delete budget");
      }
    },
    [confirm, deleteBudget],
  );

  const onBulkDelete = useCallback(async () => {
    const isConfirmed = await confirm({
      title: "Bulk Delete Budgets",
      description: `Are you sure you want to delete ${selectedIds.length} budgets? All associated sub-budgets will also be removed.`,
      variant: "destructive",
      confirmText: `Delete ${selectedIds.length}`,
    });

    if (!isConfirmed) return;

    try {
      await bulkDeleteBudgets.mutateAsync(selectedIds);
      toast.success(`${selectedIds.length} budgets removed`);
      setSelectedIds([]);
    } catch {
      toast.error("Failed to delete budgets");
    }
  }, [bulkDeleteBudgets, confirm, selectedIds]);

  return {
    budgets: budgetProgress,
    isLoading: budgets.isPending,
    selectedIds,
    onToggleSelect,
    onAddBudget,
    onEditBudget,
    onDeleteBudget,
    onBulkDelete,
  };
}
