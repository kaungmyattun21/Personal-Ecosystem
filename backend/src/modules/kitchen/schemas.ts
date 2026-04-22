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
