import { z } from "zod";

export const createGroceryItemSchema = z.object({
  name: z.string().min(1, "Name is required"),
  category: z.string().optional().nullable(),
  quantity: z.number().positive().default(1),
  unit: z.string().optional().nullable(),
  image: z.string().url("Invalid image URL").optional().nullable().or(z.literal("")),
  expiryDate: z.string().datetime().optional().nullable().or(z.date().optional().nullable()),
  status: z.enum(["AVAILABLE", "CONSUMED", "EXPIRED", "LOW_STOCK"]).default("AVAILABLE"),
});

export const createMultipleGroceryItemsSchema = z.array(createGroceryItemSchema);

export const updateGroceryItemSchema = z.object({
  name: z.string().min(1).optional(),
  category: z.string().optional().nullable(),
  quantity: z.number().positive().optional(),
  unit: z.string().optional().nullable(),
  image: z.string().url("Invalid image URL").optional().nullable().or(z.literal("")),
  expiryDate: z.string().datetime().optional().nullable().or(z.date().optional().nullable()),
  status: z.enum(["AVAILABLE", "CONSUMED", "EXPIRED", "LOW_STOCK"]).optional(),
});

export const bulkDeleteGroceryItemsSchema = z.object({
  ids: z.array(z.string()),
});

export const createShoppingListItemSchema = z.object({
  groceryItemId: z.string().optional().nullable(),
  name: z.string().min(1, "Item name is required"),
  quantity: z.number().positive().default(1),
  unit: z.string().optional().nullable(),
  category: z.string().optional().nullable(),
  image: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
});

export const createShoppingListSchema = z.object({
  name: z.string().min(1, "List name is required"),
  items: z.array(createShoppingListItemSchema).optional().default([]),
});

export const updateShoppingListItemSchema = z.object({
  id: z.string().optional(),
  groceryItemId: z.string().optional().nullable(),
  name: z.string().min(1).optional(),
  quantity: z.number().positive().optional(),
  unit: z.string().optional().nullable(),
  category: z.string().optional().nullable(),
  image: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  isCompleted: z.boolean().optional(),
});

export const updateShoppingListSchema = z.object({
  name: z.string().min(1).optional(),
  status: z.enum(["ACTIVE", "ARCHIVED"]).optional(),
  items: z.array(updateShoppingListItemSchema).optional(),
});

export const createMealSchema = z.object({
  date: z.string().datetime().or(z.date()),
  type: z.enum(["BREAKFAST", "LUNCH", "DINNER", "SNACK"]),
  name: z.string().min(1, "Meal name is required"),
  notes: z.string().optional().nullable(),
  ingredients: z.array(z.object({
    name: z.string(),
    quantity: z.number(),
    unit: z.string().optional().nullable()
  })).optional().nullable()
});

export const createMealPlanSchema = z.object({
  startDate: z.string().datetime().or(z.date()),
  endDate: z.string().datetime().or(z.date()),
  meals: z.array(createMealSchema).optional().default([]),
});

export const updateMealSchema = z.object({
  id: z.string().optional(),
  date: z.string().datetime().or(z.date()).optional(),
  type: z.enum(["BREAKFAST", "LUNCH", "DINNER", "SNACK"]).optional(),
  name: z.string().min(1).optional(),
  notes: z.string().optional().nullable(),
  ingredients: z.array(z.object({
    name: z.string(),
    quantity: z.number(),
    unit: z.string().optional().nullable()
  })).optional().nullable(),
  isCompleted: z.boolean().optional(),
});

export const updateMealPlanSchema = z.object({
  startDate: z.string().datetime().or(z.date()).optional(),
  endDate: z.string().datetime().or(z.date()).optional(),
  status: z.enum(["ACTIVE", "ARCHIVED"]).optional(),
  meals: z.array(updateMealSchema).optional(),
});
