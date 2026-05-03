import { apiClient } from "../api-client";
import {
  GroceryItem,
  ShoppingList,
  MealPlan,
  CreateGroceryItemInput,
  UpdateGroceryItemInput,
  CreateShoppingListInput,
  UpdateShoppingListInput,
  CreateMealPlanInput,
  UpdateMealPlanInput,
} from "../../types/kitchen";

export const kitchenService = {
  // Grocery Items
  getGroceryItems: async () => {
    const { data } = await apiClient.get<GroceryItem[]>("/kitchen/grocery-items");
    return data;
  },
  addGroceryItem: async (item: CreateGroceryItemInput) => {
    const { data } = await apiClient.post<GroceryItem>("/kitchen/grocery-items", item);
    return data;
  },
  addMultipleGroceryItems: async (items: CreateGroceryItemInput[]) => {
    const { data } = await apiClient.post<GroceryItem[]>("/kitchen/grocery-items/bulk", items);
    return data;
  },
  updateGroceryItem: async (id: string, item: UpdateGroceryItemInput) => {
    const { data } = await apiClient.put<GroceryItem>(`/kitchen/grocery-items/${id}`, item);
    return data;
  },
  removeGroceryItem: async (id: string) => {
    await apiClient.delete(`/kitchen/grocery-items/${id}`);
  },

  // Shopping Lists
  getShoppingLists: async () => {
    const { data } = await apiClient.get<ShoppingList[]>("/kitchen/shopping-lists");
    return data;
  },
  getShoppingList: async (id: string) => {
    const { data } = await apiClient.get<ShoppingList>(`/kitchen/shopping-lists/${id}`);
    return data;
  },
  createShoppingList: async (list: CreateShoppingListInput) => {
    const { data } = await apiClient.post<ShoppingList>("/kitchen/shopping-lists", list);
    return data;
  },
  updateShoppingList: async (id: string, list: UpdateShoppingListInput) => {
    const { data } = await apiClient.put<ShoppingList>(`/kitchen/shopping-lists/${id}`, list);
    return data;
  },
  removeShoppingList: async (id: string) => {
    await apiClient.delete(`/kitchen/shopping-lists/${id}`);
  },

  // Meal Plans
  getMealPlans: async () => {
    const { data } = await apiClient.get<MealPlan[]>("/kitchen/meal-plans");
    return data;
  },
  getMealPlan: async (id: string) => {
    const { data } = await apiClient.get<MealPlan>(`/kitchen/meal-plans/${id}`);
    return data;
  },
  createMealPlan: async (plan: CreateMealPlanInput) => {
    const { data } = await apiClient.post<MealPlan>("/kitchen/meal-plans", plan);
    return data;
  },
  updateMealPlan: async (id: string, plan: UpdateMealPlanInput) => {
    const { data } = await apiClient.put<MealPlan>(`/kitchen/meal-plans/${id}`, plan);
    return data;
  },
  removeMealPlan: async (id: string) => {
    await apiClient.delete(`/kitchen/meal-plans/${id}`);
  },
};
