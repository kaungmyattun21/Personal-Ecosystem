import { useMealPlan } from "./useMealPlan";
import { MealPlan } from "@/types/kitchen";
import { toast } from "sonner";
import { useConfirm } from "@/providers/confirm-provider";
import { useDispatch } from "react-redux";
import { openEditMealPlan, setAddMealPlanModalOpen } from "@/lib/store/features/kitchen/kitchen-slice";

export function useMealPlanController() {
  const { mealPlans, removeMealPlan } = useMealPlan();
  const { confirm } = useConfirm();
  const dispatch = useDispatch();

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
    dispatch(setAddMealPlanModalOpen(true));
  };

  const handleView = (id: string) => {
    // Navigate to detail view or open detail modal
    console.log("View meal plan:", id);
  };

  return {
    plans: mealPlans.data ?? [],
    isLoading: mealPlans.isLoading,
    handleDelete,
    handleEdit,
    handleCreate,
    handleView,
  };
}
