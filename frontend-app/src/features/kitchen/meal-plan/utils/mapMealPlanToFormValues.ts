import { MealPlan } from "@/types/kitchen";

export function mapMealPlanToFormValues(plan: MealPlan) {
  return {
    startDate: new Date(plan.startDate).toISOString().split("T")[0],
    endDate: new Date(plan.endDate).toISOString().split("T")[0],
    status: plan.status,
    meals: plan.meals?.map((m) => ({
      date: new Date(m.date).toISOString().split("T")[0],
      type: m.type,
      name: m.name,
      notes: m.notes ?? "",
      ingredients: (m.ingredients as any[])?.map((i) => ({
        name: i.name,
        quantity: i.quantity,
        unit: i.unit ?? "",
      })) || [],
    })) || [],
  };
}
