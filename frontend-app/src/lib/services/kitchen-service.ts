import { apiFetch } from "../api-client";
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
  getGroceryItems: () => apiFetch<GroceryItem[]>("/kitchen/grocery-items"),

  addGroceryItem: (item: CreateGroceryItemInput) =>
    apiFetch<GroceryItem>("/kitchen/grocery-items", { method: "POST", body: item }),

  addMultipleGroceryItems: (items: CreateGroceryItemInput[]) =>
    apiFetch<GroceryItem[]>("/kitchen/grocery-items/bulk", { method: "POST", body: items }),

  updateGroceryItem: (id: string, item: UpdateGroceryItemInput) =>
    apiFetch<GroceryItem>(`/kitchen/grocery-items/${id}`, { method: "PUT", body: item }),

  removeGroceryItem: (id: string) =>
    apiFetch(`/kitchen/grocery-items/${id}`, { method: "DELETE" }),

  // Shopping Lists
  getShoppingLists: () => apiFetch<ShoppingList[]>("/kitchen/shopping-lists"),

  getShoppingList: (id: string) =>
    apiFetch<ShoppingList>(`/kitchen/shopping-lists/${id}`),

  createShoppingList: (list: CreateShoppingListInput) =>
    apiFetch<ShoppingList>("/kitchen/shopping-lists", { method: "POST", body: list }),

  updateShoppingList: (id: string, list: UpdateShoppingListInput) =>
    apiFetch<ShoppingList>(`/kitchen/shopping-lists/${id}`, { method: "PUT", body: list }),

  removeShoppingList: (id: string) =>
    apiFetch(`/kitchen/shopping-lists/${id}`, { method: "DELETE" }),

  // Meal Plans
  getMealPlans: () => apiFetch<MealPlan[]>("/kitchen/meal-plans"),

  getMealPlan: (id: string) =>
    apiFetch<MealPlan>(`/kitchen/meal-plans/${id}`),

  createMealPlan: (plan: CreateMealPlanInput) =>
    apiFetch<MealPlan>("/kitchen/meal-plans", { method: "POST", body: plan }),

  updateMealPlan: (id: string, plan: UpdateMealPlanInput) =>
    apiFetch<MealPlan>(`/kitchen/meal-plans/${id}`, { method: "PUT", body: plan }),

  removeMealPlan: (id: string) =>
    apiFetch(`/kitchen/meal-plans/${id}`, { method: "DELETE" }),
};
