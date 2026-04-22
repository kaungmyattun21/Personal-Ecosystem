import { prisma } from "../../shared/db.js";
import { CreateGroceryItemInput, UpdateGroceryItemInput } from "./types.js";

export const createGroceryItem = async (userId: string, data: CreateGroceryItemInput) => {
  return prisma.groceryItem.create({
    data: {
      userId,
      ...data,
    },
  });
};

export const createMultipleGroceryItems = async (userId: string, dataArray: CreateGroceryItemInput[]) => {
  const data = dataArray.map((item) => ({ userId, ...item }));
  return prisma.groceryItem.createMany({
    data,
  });
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

export const updateGroceryItem = async (id: string, userId: string, data: UpdateGroceryItemInput) => {
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
