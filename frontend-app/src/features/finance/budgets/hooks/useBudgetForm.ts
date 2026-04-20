"use client";

import { useCallback, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";
import { setAddBudgetModalOpen } from "@/lib/store/features/finance/finance-slice";
import { toast } from "sonner";
import { useBudgets } from "./useBudgets";
import { useCategories } from "@/features/finance/shared/hooks/useCategories";
import {
  budgetFormSchema,
  BudgetFormValues,
  BUDGET_CREATE_DEFAULTS,
} from "../budgetFormSchema";
import { mapBudgetToFormValues } from "../mapBudgetToFormValues";
import { mapBudgetFormToPayload } from "../mapBudgetFormToPayload";
import { Budget, Category } from "@/types/finance";

export interface BudgetFormContext {
  form: ReturnType<typeof useForm<BudgetFormValues>>;
  isOpen: boolean;
  isEditMode: boolean;
  isPending: boolean;
  availableBudgets: Budget[];
  availableCategories: Category[];
  onSubmit: (values: BudgetFormValues) => Promise<void>;
  onClose: (open: boolean) => void;
}

/**
 * Controller hook for Budget Form.
 *
 * Manages form state, pre-filling, and submission logic for budgets and sub-budgets.
 */
export function useBudgetForm(): BudgetFormContext {
  const dispatch = useDispatch();

  const isOpen = useSelector(
    (state: RootState) => state.finance.isAddBudgetModalOpen,
  );
  const editingBudgetId = useSelector(
    (state: RootState) => state.finance.editingBudgetId,
  );

  const { budgets, createBudget, updateBudget } = useBudgets();
  const { categories } = useCategories();

  const isEditMode = !!editingBudgetId;

  const editingBudget = useMemo(() => {
    if (!budgets.data || !editingBudgetId) return null;

    let found = budgets.data.find((b) => b.id === editingBudgetId);
    if (found) return found;

    for (const b of budgets.data) {
      if (b.subBudgets) {
        found = b.subBudgets.find((sub) => sub.id === editingBudgetId);
        if (found) return found;
      }
    }
    return null;
  }, [budgets.data, editingBudgetId]);

  const form = useForm<BudgetFormValues>({
    resolver: zodResolver(budgetFormSchema) as any,
    defaultValues: BUDGET_CREATE_DEFAULTS as any,
  });

  // Prefill effect
  useEffect(() => {
    if (isOpen) {
      if (isEditMode && editingBudget) {
        form.reset(mapBudgetToFormValues(editingBudget));
      } else if (!isEditMode) {
        form.reset(BUDGET_CREATE_DEFAULTS);
      }
    } else {
      form.reset(BUDGET_CREATE_DEFAULTS);
    }
  }, [isOpen, isEditMode, editingBudget, form]);

  const onClose = useCallback(
    (open: boolean) => {
      dispatch(setAddBudgetModalOpen(open));
    },
    [dispatch],
  );

  const onSubmit = useCallback(
    async (values: BudgetFormValues) => {
      const payload = mapBudgetFormToPayload(values);

      try {
        if (isEditMode && editingBudgetId) {
          await updateBudget.mutateAsync({
            id: editingBudgetId,
            data: payload as any,
          });
        } else {
          await createBudget.mutateAsync(payload as any);
        }
        dispatch(setAddBudgetModalOpen(false));
        form.reset();
      } catch (error: any) {
        console.error("Failed to save budget:", error);
        const errorMessage =
          error.response?.data?.message || "Failed to save budget data.";
        toast.error(errorMessage);
      }
    },
    [isEditMode, editingBudgetId, createBudget, updateBudget, dispatch, form],
  );

  const isPending = createBudget.isPending || updateBudget.isPending;

  // Derive flat list of budgets for the parent selector, filtered to avoid circular parents
  const availableBudgets = useMemo(() => {
    const list: Budget[] = [];
    for (const budget of budgets.data || []) {
      if (budget.id !== editingBudgetId && !budget.parentId) {
        list.push(budget);
      }
    }
    return list;
  }, [budgets.data, editingBudgetId]);

  return {
    form,
    isOpen,
    isEditMode,
    isPending,
    availableBudgets,
    availableCategories: (categories.data as Category[]) || [],
    onSubmit,
    onClose,
  };
}
