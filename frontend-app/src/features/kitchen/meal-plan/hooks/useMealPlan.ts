import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { kitchenService } from "@/lib/services/kitchen-service";
import { CreateMealPlanInput, UpdateMealPlanInput, MealPlan } from "@/types/kitchen";
import { kitchenKeys, kitchenQueries } from "../../shared/kitchenQueries";
import { useAuthReady } from "@/lib/hooks/useAuthReady";

export function useMealPlan() {
  const queryClient = useQueryClient();
  const authReady = useAuthReady();

  const mealPlans = useQuery({ ...kitchenQueries.mealPlans(), enabled: authReady });

  const createMealPlan = useMutation({
    mutationFn: (plan: CreateMealPlanInput) => kitchenService.createMealPlan(plan),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: kitchenKeys.mealPlans.all() });
    },
  });

  const updateMealPlan = useMutation({
    mutationFn: ({ id, plan }: { id: string; plan: UpdateMealPlanInput }) =>
      kitchenService.updateMealPlan(id, plan),
    onMutate: async ({ id, plan }) => {
      await queryClient.cancelQueries({ queryKey: kitchenKeys.mealPlans.all() });
      const previous = queryClient.getQueryData<MealPlan[]>(kitchenKeys.mealPlans.all());
      if (previous) {
        queryClient.setQueryData<MealPlan[]>(
          kitchenKeys.mealPlans.all(),
          previous.map((p) => (p.id === id ? ({ ...p, ...plan } as MealPlan) : p)),
        );
      }
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(kitchenKeys.mealPlans.all(), context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: kitchenKeys.mealPlans.all() });
    },
  });

  const removeMealPlan = useMutation({
    mutationFn: (id: string) => kitchenService.removeMealPlan(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: kitchenKeys.mealPlans.all() });
      const previous = queryClient.getQueryData<MealPlan[]>(kitchenKeys.mealPlans.all());
      if (previous) {
        queryClient.setQueryData<MealPlan[]>(
          kitchenKeys.mealPlans.all(),
          previous.filter((p) => p.id !== id),
        );
      }
      return { previous };
    },
    onError: (_err, _id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(kitchenKeys.mealPlans.all(), context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: kitchenKeys.mealPlans.all() });
    },
  });

  return {
    mealPlans,
    createMealPlan,
    updateMealPlan,
    removeMealPlan,
  };
}
