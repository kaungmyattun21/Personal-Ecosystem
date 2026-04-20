"use client";

import { useCallback, useEffect, useMemo } from "react";
import { UseFormReturn, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";
import { setAddTransactionModalOpen } from "@/lib/store/features/finance/finance-slice";
import { useTransactions } from "./useTransactions";
import { useCategories } from "@/features/finance/shared/hooks/useCategories";
import { useBudgets } from "@/features/finance/budgets/hooks/useBudgets";
import { useSavingGoals } from "@/features/finance/goals/hooks/useSavingGoals";
import { useAccounts } from "@/features/finance/shared/hooks/useAccounts";
import {
  transactionFormSchema,
  TransactionFormValues,
  CREATE_DEFAULTS,
} from "../transactionFormSchema";
import { mapTransactionToFormValues } from "../mapTransactionToFormValues";
import { mapTransactionFormToPayload } from "../mapTransactionFormToPayload";
import { Category, Transaction, Budget, SavingGoal, Account } from "@/types/finance";
import { toast } from "sonner";

export interface TransactionFormContext {
  form: UseFormReturn<TransactionFormValues>;
  isOpen: boolean;
  isEditMode: boolean;
  isPending: boolean;
  categories: Category[];
  budgets: Budget[];
  savingGoals: SavingGoal[];
  accounts: Account[];
  onSubmit: (values: TransactionFormValues) => Promise<void>;
  onClose: (open: boolean) => void;
}

/**
 * Controller hook for Transaction Form.
 * Handles form state, validation, and submission for creating/editing transactions.
 */
export function useTransactionForm(): TransactionFormContext {
  const dispatch = useDispatch();

  const isOpen = useSelector(
    (state: RootState) => state.finance.isAddTransactionModalOpen,
  );
  const editingTransactionId = useSelector(
    (state: RootState) => state.finance.editingTransactionId,
  );

  const { transactions, createTransaction, updateTransaction } = useTransactions();
  const { categories } = useCategories();
  const { budgets } = useBudgets();
  const { savingGoals, createSavingContribution } = useSavingGoals();
  const { accounts } = useAccounts();

  const isEditMode = !!editingTransactionId;

  const editingTransaction = useMemo(
    () =>
      transactions.data?.find((t) => t.id === editingTransactionId) ?? null,
    [transactions.data, editingTransactionId],
  );

  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionFormSchema) as any,
    defaultValues: CREATE_DEFAULTS,
  });

  // Handle pre-filling on modal open or edit switch
  useEffect(() => {
    if (!isOpen) return;

    if (isEditMode && editingTransaction) {
      form.reset(mapTransactionToFormValues(editingTransaction));
    } else if (!isEditMode) {
      const defaultValues = { ...CREATE_DEFAULTS };
      // If we have accounts, pre-select the first one if current accountId is empty
      if (accounts.data && accounts.data.length > 0 && !form.getValues("accountId")) {
        defaultValues.accountId = accounts.data[0].id;
      }
      form.reset(defaultValues);
    }
  }, [isOpen, isEditMode, editingTransaction, form, accounts.data]);

  const onClose = useCallback(
    (open: boolean) => {
      dispatch(setAddTransactionModalOpen(open));
    },
    [dispatch],
  );

  const onSubmit = useCallback(
    async (values: TransactionFormValues) => {
      const payload = mapTransactionFormToPayload(values);

      try {
        if (isEditMode && editingTransactionId) {
          await updateTransaction.mutateAsync({
            id: editingTransactionId,
            data: payload as any,
          });
          toast.success("Transaction updated");
        } else {
          // If it's a saving goal contribution, we handle it specially
          if (values.applyAsContribution && values.savingGoalId) {
            await createSavingContribution.mutateAsync({
              goalId: values.savingGoalId,
              amount: values.amount,
              date: values.date,
              description: values.description,
              accountId: values.accountId,
            });
            toast.success("Saving contribution recorded");
          } else {
            await createTransaction.mutateAsync(payload as any);
            toast.success("Transaction recorded");
          }
        }
        dispatch(setAddTransactionModalOpen(false));
        form.reset();
      } catch (error: any) {
        console.error("Failed to save transaction:", error);
        toast.error("Operation failed");
      }
    },
    [isEditMode, editingTransactionId, createTransaction, updateTransaction, createSavingContribution, dispatch, form],
  );

  const isPending = createTransaction.isPending || updateTransaction.isPending || createSavingContribution.isPending;

  return {
    form,
    isOpen,
    isEditMode,
    isPending,
    categories: (categories.data as Category[]) || [],
    budgets: (budgets.data as Budget[]) || [],
    savingGoals: (savingGoals.data as SavingGoal[]) || [],
    accounts: (accounts.data as Account[]) || [],
    onSubmit,
    onClose,
  };
}
