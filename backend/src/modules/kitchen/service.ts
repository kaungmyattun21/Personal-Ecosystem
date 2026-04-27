import * as repo from "./repository.js";
import { AppError } from "../../shared/utils/AppError.js";
import { 
  CreateGroceryItemInput, 
  UpdateGroceryItemInput,
  CreateShoppingListInput,
  UpdateShoppingListInput,
  CreateMealPlanInput,
  UpdateMealPlanInput,
} from "./types.js";

export const addGroceryItem = async (userId: string, data: CreateGroceryItemInput) => {
  return repo.createGroceryItem(userId, data);
};

export const addMultipleGroceryItems = async (userId: string, dataArray: CreateGroceryItemInput[]) => {
  if (dataArray.length === 0) {
    throw new AppError("Cannot create empty array of grocery items", 400);
  }
  return repo.createMultipleGroceryItems(userId, dataArray);
};

export const getGroceryItems = async (userId: string) => {
  return repo.findGroceryItems(userId);
};

export const getGroceryItem = async (id: string, userId: string) => {
  const item = await repo.findGroceryItemById(id, userId);
  if (!item) {
    throw new AppError("Grocery item not found", 404);
  }
  return item;
};

export const updateGroceryItem = async (id: string, userId: string, data: UpdateGroceryItemInput) => {
  const item = await repo.findGroceryItemById(id, userId);
  if (!item) {
    throw new AppError("Grocery item not found", 404);
  }
  return repo.updateGroceryItem(id, userId, data);
};

export const removeGroceryItem = async (id: string, userId: string) => {
  const item = await repo.findGroceryItemById(id, userId);
  if (!item) {
    throw new AppError("Grocery item not found", 404);
  }
  return repo.deleteGroceryItem(id, userId);
};

export const createShoppingList = async (userId: string, data: CreateShoppingListInput) => {
  return repo.createShoppingList(userId, data);
};

export const getShoppingLists = async (userId: string) => {
  return repo.findShoppingLists(userId);
};

export const getShoppingList = async (id: string, userId: string) => {
  const list = await repo.findShoppingListById(id, userId);
  if (!list) {
    throw new AppError("Shopping list not found", 404);
  }
  return list;
};

export const updateShoppingList = async (id: string, userId: string, data: UpdateShoppingListInput) => {
  const list = await repo.findShoppingListById(id, userId);
  if (!list) {
    throw new AppError("Shopping list not found", 404);
  }
  return repo.updateShoppingList(id, userId, data);
};

export const removeShoppingList = async (id: string, userId: string) => {
  const list = await repo.findShoppingListById(id, userId);
  if (!list) {
    throw new AppError("Shopping list not found", 404);
  }
  return repo.deleteShoppingList(id, userId);
};

export const createMealPlan = async (userId: string, data: CreateMealPlanInput) => {
  return repo.createMealPlan(userId, data);
};

export const getMealPlans = async (userId: string) => {
  return repo.findMealPlans(userId);
};

export const getMealPlan = async (id: string, userId: string) => {
  const plan = await repo.findMealPlanById(id, userId);
  if (!plan) {
    throw new AppError("Meal plan not found", 404);
  }
  return plan;
};

export const updateMealPlan = async (id: string, userId: string, data: UpdateMealPlanInput) => {
  const plan = await repo.findMealPlanById(id, userId);
  if (!plan) {
    throw new AppError("Meal plan not found", 404);
  }
  return repo.updateMealPlan(id, userId, data);
};

export const removeMealPlan = async (id: string, userId: string) => {
  const plan = await repo.findMealPlanById(id, userId);
  if (!plan) {
    throw new AppError("Meal plan not found", 404);
  }
  return repo.deleteMealPlan(id, userId);
};
