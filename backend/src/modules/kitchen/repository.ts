import { prisma } from "../../shared/db.js";
import { Prisma } from "@prisma/client";
import {
  CreateGroceryItemInput,
  UpdateGroceryItemInput,
  CreateShoppingListInput,
  UpdateShoppingListInput,
  CreateMealPlanInput,
  UpdateMealPlanInput,
} from "./types.js";

export const createGroceryItem = async (
  userId: string,
  data: CreateGroceryItemInput,
) => {
  const input: Prisma.GroceryItemUncheckedCreateInput = { userId, ...data };
  return prisma.groceryItem.create({ data: input });
};

export const createMultipleGroceryItems = async (
  userId: string,
  dataArray: CreateGroceryItemInput[],
) => {
  const data: Prisma.GroceryItemCreateManyInput[] = dataArray.map((item) => ({ userId, ...item }));
  return prisma.groceryItem.createMany({ data });
};

export const findGroceryItems = async (userId: string) => {
  return prisma.groceryItem.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
};

export const findGroceryItemById = async (id: string, userId: string) => {
  return prisma.groceryItem.findUnique({
    where: { id, userId },
  });
};

export const updateGroceryItem = async (
  id: string,
  userId: string,
  data: UpdateGroceryItemInput,
) => {
  return prisma.groceryItem.update({
    where: { id, userId },
    data,
  });
};

export const deleteGroceryItem = async (id: string, userId: string) => {
  return prisma.groceryItem.delete({
    where: { id, userId },
  });
};

export const deleteGroceryItems = async (userId: string, ids: string[]) => {
  return prisma.groceryItem.deleteMany({
    where: {
      userId,
      id: { in: ids },
    },
  });
};

export const createShoppingList = async (
  userId: string,
  data: CreateShoppingListInput,
) => {
  const { items, ...listData } = data;
  const itemsInput: Prisma.ShoppingListItemUncheckedCreateWithoutShoppingListInput[] = items ?? [];
  return prisma.shoppingList.create({
    data: {
      userId,
      ...listData,
      items: {
        create: itemsInput,
      },
    },
    include: { items: true },
  });
};

export const findShoppingLists = async (userId: string) => {
  return prisma.shoppingList.findMany({
    where: { userId },
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });
};

export const findShoppingListById = async (id: string, userId: string) => {
  return prisma.shoppingList.findUnique({
    where: { id, userId },
    include: { items: true },
  });
};

export const updateShoppingList = async (
  id: string,
  userId: string,
  data: UpdateShoppingListInput,
) => {
  const { items, ...listData } = data;

  return prisma.shoppingList.update({
    where: { id, userId },
    data: listData,
    include: { items: true },
  });
};

export const deleteShoppingList = async (id: string, userId: string) => {
  return prisma.shoppingList.delete({
    where: { id, userId },
  });
};

export const createMealPlan = async (
  userId: string,
  data: CreateMealPlanInput,
) => {
  const { meals, ...planData } = data;
  const mealsInput: Prisma.MealCreateWithoutMealPlanInput[] = (meals ?? []).map((m: any) => ({
    ...m,
    ingredients: m.ingredients ? m.ingredients : undefined,
  }));

  return prisma.mealPlan.create({
    data: {
      userId,
      ...planData,
      meals: {
        create: mealsInput,
      },
    },
    include: { meals: true },
  });
};

export const findMealPlans = async (userId: string) => {
  return prisma.mealPlan.findMany({
    where: { userId },
    include: { meals: true },
    orderBy: { startDate: "desc" },
  });
};

export const findMealPlanById = async (id: string, userId: string) => {
  return prisma.mealPlan.findUnique({
    where: { id, userId },
    include: { meals: true },
  });
};

export const updateMealPlan = async (
  id: string,
  userId: string,
  data: UpdateMealPlanInput,
) => {
  const { meals, ...planData } = data;

  return prisma.mealPlan.update({
    where: { id, userId },
    data: planData,
    include: { meals: true },
  });
};

export const deleteMealPlan = async (id: string, userId: string) => {
  return prisma.mealPlan.delete({
    where: { id, userId },
  });
};
