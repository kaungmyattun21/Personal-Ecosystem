import React from "react";
import { useMealPlan } from "./useMealPlan";
import { MealPlan } from "@/types/kitchen";
import { toast } from "sonner";
import { useConfirm } from "@/providers/confirm-provider";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";
import { openEditMealPlan, setMealPlanEditorOpen, setViewingMealPlanId } from "@/lib/store/features/kitchen/kitchen-slice";
import { eachDayOfInterval, parseISO, isSameDay } from "date-fns";

export function useMealPlanController() {
  const { mealPlans, removeMealPlan } = useMealPlan();
  const { confirm } = useConfirm();
  const { viewingMealPlanId, isMealPlanEditorOpen } = useSelector((state: RootState) => state.kitchen);
  const dispatch = useDispatch();

  // State for weekly view
  const [selectedDay, setSelectedDay] = React.useState<Date | null>(null);
  const [viewMode, setViewMode] = React.useState<"cards" | "grid">("cards");

  const handleDelete = async (id: string) => {
    const plan = mealPlans.data?.find(p => p.id === id);
    const isConfirmed = await confirm({
      title: "Delete Meal Plan",
      description: `Are you sure you want to delete this meal plan? All scheduled meals within this plan will be removed.`,
      confirmText: "Delete",
      variant: "destructive",
    });

    if (isConfirmed) {
      try {
        await removeMealPlan.mutateAsync(id);
        toast.success("Meal plan deleted");
      } catch (error) {
        toast.error("Failed to delete plan");
      }
    }
  };

  const handleEdit = (plan: MealPlan) => {
    dispatch(openEditMealPlan(plan.id));
  };

  const handleCreate = () => {
    dispatch(setMealPlanEditorOpen(true));
  };

  const handleView = (id: string | null) => {
    dispatch(setViewingMealPlanId(id));
    setSelectedDay(null); // Reset selected day when switching plans
  };

  const getDaysInterval = (plan: MealPlan) => {
    if (!plan.startDate || !plan.endDate) return [];
    return eachDayOfInterval({
      start: parseISO(plan.startDate),
      end: parseISO(plan.endDate),
    });
  };

  const getMealsForDay = (plan: MealPlan, day: Date) => {
    const dayMeals = (plan.meals || []).filter((meal) => 
      isSameDay(parseISO(meal.date), day)
    );

    const typeOrder: Record<string, number> = { BREAKFAST: 1, LUNCH: 2, DINNER: 3, SNACK: 4 };
    return dayMeals.sort((a, b) => (typeOrder[a.type] || 99) - (typeOrder[b.type] || 99));
  };

  return {
    plans: mealPlans.data ?? [],
    viewingMealPlanId,
    isMealPlanEditorOpen,
    isLoading: mealPlans.isLoading,
    selectedDay,
    setSelectedDay,
    viewMode,
    setViewMode,
    getDaysInterval,
    getMealsForDay,
    handleDelete,
    handleEdit,
    handleCreate,
    handleView,
  };
}
