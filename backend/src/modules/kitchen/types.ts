import { z } from "zod";
import {
  createGroceryItemSchema,
  updateGroceryItemSchema,
  createMultipleGroceryItemsSchema,
} from "./schemas.js";

export type CreateGroceryItemInput = z.infer<typeof createGroceryItemSchema>;
export type CreateMultipleGroceryItemsInput = z.infer<typeof createMultipleGroceryItemsSchema>;
export type UpdateGroceryItemInput = z.infer<typeof updateGroceryItemSchema>;

export interface IGroceryItem {
  id: string;
  userId: string;
  name: string;
  category: string | null;
  quantity: number;
  unit: string | null;
  image: string | null;
  expiryDate: Date | null;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}
