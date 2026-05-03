import { queryOptions } from "@tanstack/react-query";
import { kitchenService } from "@/lib/services/kitchen-service";

export const kitchenKeys = {
  all: ["kitchen"] as const,
  groceryItems: () => [...kitchenKeys.all, "grocery-items"] as const,
  shoppingLists: {
    all: () => [...kitchenKeys.all, "shopping-lists"] as const,
    detail: (id: string) => [...kitchenKeys.shoppingLists.all(), "detail", id] as const,
  },
  mealPlans: {
    all: () => [...kitchenKeys.all, "meal-plans"] as const,
    detail: (id: string) => [...kitchenKeys.mealPlans.all(), "detail", id] as const,
  },
};

export const kitchenQueries = {
  groceryItems: () =>
    queryOptions({
      queryKey: kitchenKeys.groceryItems(),
      queryFn: kitchenService.getGroceryItems,
    }),
  shoppingLists: () =>
    queryOptions({
      queryKey: kitchenKeys.shoppingLists.all(),
      queryFn: kitchenService.getShoppingLists,
    }),
  shoppingList: (id: string) =>
    queryOptions({
      queryKey: kitchenKeys.shoppingLists.detail(id),
      queryFn: () => kitchenService.getShoppingList(id),
      enabled: !!id,
    }),
  mealPlans: () =>
    queryOptions({
      queryKey: kitchenKeys.mealPlans.all(),
      queryFn: kitchenService.getMealPlans,
    }),
  mealPlan: (id: string) =>
    queryOptions({
      queryKey: kitchenKeys.mealPlans.detail(id),
      queryFn: () => kitchenService.getMealPlan(id),
      enabled: !!id,
    }),
};
