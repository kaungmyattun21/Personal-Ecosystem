"use client";

import { useSavingGoals } from "./hooks/useSavingGoals";
import { useDispatch } from "react-redux";
import { openEditSavingGoal, setAddSavingGoalModalOpen } from "@/lib/store/features/finance/finance-slice";
import { toast } from "sonner";
import { useConfirm } from "@/providers/confirm-provider";

export function useSavingGoalsController() {
  const dispatch = useDispatch();
  const { confirm } = useConfirm();
  const { savingGoals, deleteSavingGoal, createSavingContribution } = useSavingGoals();

  const handleAddGoal = () => {
    dispatch(setAddSavingGoalModalOpen(true));
  };

  const handleEditGoal = (id: string) => {
    dispatch(openEditSavingGoal(id));
  };

  const handleDeleteGoal = async (id: string) => {
    const isConfirmed = await confirm({
      title: "Delete Saving Goal",
      description: "Are you sure you want to delete this saving goal? This action cannot be undone and all tracked progress for this goal will be archived.",
      confirmText: "Delete Goal",
      variant: "destructive",
    });

    if (isConfirmed) {
      try {
        await deleteSavingGoal.mutateAsync(id);
        toast.success("Goal deleted successfully.");
      } catch (error) {
        toast.error("Failed to delete goal.");
      }
    }
  };

  const handleManualContribution = async (goalId: string, amount: number) => {
    try {
      await createSavingContribution.mutateAsync({
        savingGoalId: goalId,
        amount: amount,
        source: "MANUAL",
        date: new Date().toISOString(),
      });
      toast.success("Contribution added successfully.");
    } catch (error) {
      toast.error("Failed to add contribution.");
    }
  };

  return {
    goals: savingGoals.data || [],
    isLoading: savingGoals.isLoading,
    handleAddGoal,
    handleEditGoal,
    handleDeleteGoal,
    handleManualContribution,
  };
}
