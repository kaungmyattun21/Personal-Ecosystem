import { useGroceries } from "../../groceries/hooks/useGroceries";
import { useShoppingList } from "../../shopping-list/hooks/useShoppingList";
import { useMealPlan } from "../../meal-plan/hooks/useMealPlan";
import { useMemo } from "react";

export function useKitchenOverviewController() {
  const { groceryItems } = useGroceries();
  const { shoppingLists } = useShoppingList();
  const { mealPlans } = useMealPlan();

  const stats = useMemo(() => {
    const groceries = groceryItems.data ?? [];
    const lists = shoppingLists.data ?? [];
    const plans = mealPlans.data ?? [];

    const expiredItems = groceries.filter(
      (item) => item.expiryDate && new Date(item.expiryDate) < new Date(),
    ).length;

    const lowStockItems = groceries.filter(
      (item) => item.status === "LOW_STOCK",
    ).length;

    const activeLists = lists.filter((list) => list.status === "ACTIVE").length;

    const upcomingMeals = plans
      .filter((plan) => plan.status === "ACTIVE")
      .reduce((acc, plan) => acc + (plan.meals?.length || 0), 0);

    const totalEstimatedCost = lists
      .filter((list) => list.status === "ACTIVE")
      .reduce((acc, list) => acc + parseFloat(list.estimatedCost), 0);

    return {
      totalGroceries: groceries.length,
      expiredItems,
      lowStockItems,
      activeLists,
      upcomingMeals,
      totalEstimatedCost: totalEstimatedCost.toFixed(2),
    };
  }, [groceryItems.data, shoppingLists.data, mealPlans.data]);

  const isLoading =
    groceryItems.isLoading || shoppingLists.isLoading || mealPlans.isLoading;

  return {
    stats,
    isLoading,
  };
}
