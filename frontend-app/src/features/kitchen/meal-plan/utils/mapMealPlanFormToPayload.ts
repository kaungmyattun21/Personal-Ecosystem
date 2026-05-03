import { CreateMealPlanInput } from "@/types/kitchen";

export function mapMealPlanFormToPayload(values: any): CreateMealPlanInput {
  return {
    startDate: new Date(values.startDate).toISOString(),
    endDate: new Date(values.endDate).toISOString(),
    status: values.status,
    meals: values.meals?.map((m: any) => ({
      ...m,
      date: new Date(m.date).toISOString(),
    })) || [],
  };
}
