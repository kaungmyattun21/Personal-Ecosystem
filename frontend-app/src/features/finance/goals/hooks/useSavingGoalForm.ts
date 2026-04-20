"use client";

import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";
import { setAddSavingGoalModalOpen } from "@/lib/store/features/finance/finance-slice";
import { useSavingGoals } from "./useSavingGoals";
import { savingGoalFormSchema, SavingGoalFormValues } from "../savingGoalFormSchema";
import { mapSavingGoalFormToPayload } from "../mapSavingGoalFormToPayload";
import { toast } from "sonner";
import { SavingGoal } from "@/types/finance";

export interface SavingGoalFormContext {
  form: ReturnType<typeof useForm<SavingGoalFormValues>>;
  isOpen: boolean;
  isEditMode: boolean;
  isPending: boolean;
  onSubmit: (values: SavingGoalFormValues) => Promise<void>;
  onCancel: () => void;
}

/**
 * Controller hook for Saving Goal Form.
 * 
 * Manages form state, pre-filling, and submission logic for financial targets.
 */
export function useSavingGoalForm(): SavingGoalFormContext {
  const dispatch = useDispatch();
  const { savingGoals, createSavingGoal, updateSavingGoal } = useSavingGoals();
  const { editingSavingGoalId, isAddSavingGoalModalOpen } = useSelector(
    (state: RootState) => state.finance,
  );

  const isEditMode = !!editingSavingGoalId;

  const editingGoal = useMemo(() => 
    editingSavingGoalId
      ? savingGoals.data?.find((goal: SavingGoal) => goal.id === editingSavingGoalId)
      : null
  , [editingSavingGoalId, savingGoals.data]);

  const form = useForm<SavingGoalFormValues>({
    resolver: zodResolver(savingGoalFormSchema) as any,
    defaultValues: {
      name: "",
      targetAmount: 0,
      currentAmount: 0,
      targetDate: null,
      color: "#10b981",
      icon: "Target",
    },
  });

  // Handle pre-filling on modal open or edit switch
  useEffect(() => {
    if (!isAddSavingGoalModalOpen) return;

    if (isEditMode && editingGoal) {
      form.reset({
        name: editingGoal.name,
        targetAmount: Number(editingGoal.targetAmount),
        currentAmount: Number(editingGoal.currentAmount),
        targetDate: editingGoal.targetDate ? editingGoal.targetDate.split('T')[0] : null,
        color: editingGoal.color || "#10b981",
        icon: editingGoal.icon || "Target",
      });
    } else if (!isEditMode) {
      form.reset({
        name: "",
        targetAmount: 0,
        currentAmount: 0,
        targetDate: null,
        color: "#10b981",
        icon: "Target",
      });
    }
  }, [isAddSavingGoalModalOpen, isEditMode, editingGoal, form]);

  const onSubmit = async (values: SavingGoalFormValues) => {
    try {
      const apiData = mapSavingGoalFormToPayload(values);

      if (isEditMode && editingSavingGoalId) {
        await updateSavingGoal.mutateAsync({
          id: editingSavingGoalId,
          data: apiData as any,
        });
        toast.success("Saving goal updated!");
      } else {
        await createSavingGoal.mutateAsync(apiData as any);
        toast.success("Saving goal created!");
      }
      dispatch(setAddSavingGoalModalOpen(false));
      form.reset();
    } catch (error: any) {
      console.error("Failed to save goal:", error);
      toast.error(error.response?.data?.message || "Failed to save goal.");
    }
  };

  const onCancel = () => {
    dispatch(setAddSavingGoalModalOpen(false));
  };

  return {
    form,
    isOpen: isAddSavingGoalModalOpen,
    isEditMode,
    isPending: createSavingGoal.isPending || updateSavingGoal.isPending,
    onSubmit,
    onCancel,
  };
}
