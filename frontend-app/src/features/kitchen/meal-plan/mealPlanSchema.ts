import * as z from "zod";

export const ingredientSchema = z.object({
  name: z.string().min(1, "Ingredient name is required"),
  quantity: z.number().min(0, "Quantity must be at least 0"),
  unit: z.string().optional(),
});

export const mealFormSchema = z.object({
  date: z.string().min(1, "Date is required"),
  type: z.enum(["BREAKFAST", "LUNCH", "DINNER", "SNACK"]),
  name: z.string().min(1, "Meal name is required"),
  notes: z.string().optional(),
  ingredients: z.array(ingredientSchema).optional().default([]),
});

export const mealPlanFormSchema = z.object({
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  status: z.enum(["ACTIVE", "ARCHIVED"]),
  meals: z.array(mealFormSchema).optional().default([]),
});

export type MealPlanFormValues = z.infer<typeof mealPlanFormSchema>;
export type MealFormValues = z.infer<typeof mealFormSchema>;
export type IngredientValues = z.infer<typeof ingredientSchema>;

export const MEAL_PLAN_FORM_DEFAULTS: MealPlanFormValues = {
  startDate: new Date().toISOString().split("T")[0],
  endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
  status: "ACTIVE",
  meals: [],
};

export const MEAL_FORM_DEFAULTS: MealFormValues = {
  date: new Date().toISOString().split("T")[0],
  type: "BREAKFAST",
  name: "",
  notes: "",
  ingredients: [],
};

export const INGREDIENT_DEFAULTS: IngredientValues = {
  name: "",
  quantity: 0,
  unit: "",
};
