import * as repo from "./repository.js";
import { 
  CreateGroceryItemInput, 
  UpdateGroceryItemInput,
  CreateShoppingListInput,
  UpdateShoppingListInput
} from "./types.js";

export const addGroceryItem = async (userId: string, data: CreateGroceryItemInput) => {
  return repo.createGroceryItem(userId, data);
};

export const addMultipleGroceryItems = async (userId: string, dataArray: CreateGroceryItemInput[]) => {
  if (dataArray.length === 0) {
    throw new Error("Cannot create empty array of grocery items");
  }
  return repo.createMultipleGroceryItems(userId, dataArray);
};

export const getGroceryItems = async (userId: string) => {
  return repo.findGroceryItems(userId);
};

export const getGroceryItem = async (id: string, userId: string) => {
  const item = await repo.findGroceryItemById(id, userId);
  if (!item) {
    throw new Error("Grocery item not found");
  }
  return item;
};

export const updateGroceryItem = async (id: string, userId: string, data: UpdateGroceryItemInput) => {
  const item = await repo.findGroceryItemById(id, userId);
  if (!item) {
    throw new Error("Grocery item not found");
  }
  return repo.updateGroceryItem(id, userId, data);
};

export const removeGroceryItem = async (id: string, userId: string) => {
  const item = await repo.findGroceryItemById(id, userId);
  if (!item) {
    throw new Error("Grocery item not found");
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
    throw new Error("Shopping list not found");
  }
  return list;
};

export const updateShoppingList = async (id: string, userId: string, data: UpdateShoppingListInput) => {
  const list = await repo.findShoppingListById(id, userId);
  if (!list) {
    throw new Error("Shopping list not found");
  }
  return repo.updateShoppingList(id, userId, data);
};

export const removeShoppingList = async (id: string, userId: string) => {
  const list = await repo.findShoppingListById(id, userId);
  if (!list) {
    throw new Error("Shopping list not found");
  }
  return repo.deleteShoppingList(id, userId);
};
