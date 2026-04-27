import { describe, it, expect, vi, beforeEach } from "vitest";
import * as service from "./service.js";
import * as repo from "./repository.js";
import {
  CreateGroceryItemInput,
  UpdateGroceryItemInput,
  CreateShoppingListInput,
  UpdateShoppingListInput,
  CreateMealPlanInput,
  UpdateMealPlanInput,
} from "./types.js";
import { GroceryItem, ShoppingList, ShoppingListItem, MealPlan, Meal } from "@prisma/client";

vi.mock("./repository.js");

describe("Kitchen Service", () => {
  const userId = "user_123";

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Grocery Items", () => {
    it("should add a single grocery item", async () => {
      const data: CreateGroceryItemInput = {
        name: "Apple",
        quantity: 5,
        category: "Produce",
        image: "img.jpg",
        unit: "kg",
        status: "AVAILABLE",
      };
      vi.mocked(repo.createGroceryItem).mockResolvedValue({
        id: "item_1",
        userId,
        ...data,
      } as unknown as GroceryItem);

      const result = await service.addGroceryItem(userId, data);

      expect(repo.createGroceryItem).toHaveBeenCalledWith(userId, data);
      expect(result.id).toBe("item_1");
    });

    it("should add multiple grocery items", async () => {
      const dataArray: CreateGroceryItemInput[] = [
        {
          name: "Apple",
          quantity: 5,
          category: "Produce",
          image: "img.jpg",
          unit: "kg",
          status: "AVAILABLE",
        },
        {
          name: "Banana",
          quantity: 10,
          category: "Produce",
          image: "img.jpg",
          unit: "kg",
          status: "AVAILABLE",
        },
      ];
      vi.mocked(repo.createMultipleGroceryItems).mockResolvedValue({
        count: 2,
      });

      const result = await service.addMultipleGroceryItems(userId, dataArray);

      expect(repo.createMultipleGroceryItems).toHaveBeenCalledWith(
        userId,
        dataArray,
      );
      expect(result.count).toBe(2);
    });

    it("should fail to add empty array of grocery items", async () => {
      await expect(service.addMultipleGroceryItems(userId, [])).rejects.toThrow(
        "Cannot create empty array of grocery items",
      );
    });

    it("should get all grocery items", async () => {
      const mockItems = [{ id: "item_1", name: "Apple" }];
      vi.mocked(repo.findGroceryItems).mockResolvedValue(mockItems as unknown as GroceryItem[]);

      const result = await service.getGroceryItems(userId);

      expect(repo.findGroceryItems).toHaveBeenCalledWith(userId);
      expect(result).toEqual(mockItems);
    });

    it("should get a single grocery item", async () => {
      const mockItem = { id: "item_1", name: "Apple" };
      vi.mocked(repo.findGroceryItemById).mockResolvedValue(mockItem as unknown as GroceryItem);

      const result = await service.getGroceryItem("item_1", userId);

      expect(repo.findGroceryItemById).toHaveBeenCalledWith("item_1", userId);
      expect(result).toEqual(mockItem);
    });

    it("should throw if getting non-existent grocery item", async () => {
      vi.mocked(repo.findGroceryItemById).mockResolvedValue(null);

      await expect(service.getGroceryItem("item_1", userId)).rejects.toThrow(
        "Grocery item not found",
      );
    });

    it("should update grocery item", async () => {
      const updateData = { quantity: 10 };
      vi.mocked(repo.findGroceryItemById).mockResolvedValue({
        id: "item_1",
      } as unknown as GroceryItem);
      vi.mocked(repo.updateGroceryItem).mockResolvedValue({
        id: "item_1",
        ...updateData,
      } as unknown as GroceryItem);

      const result = await service.updateGroceryItem(
        "item_1",
        userId,
        updateData,
      );

      expect(repo.updateGroceryItem).toHaveBeenCalledWith(
        "item_1",
        userId,
        updateData,
      );
      expect(result.quantity).toBe(10);
    });

    it("should delete grocery item", async () => {
      vi.mocked(repo.findGroceryItemById).mockResolvedValue({
        id: "item_1",
      } as unknown as GroceryItem);
      vi.mocked(repo.deleteGroceryItem).mockResolvedValue({
        id: "item_1",
      } as unknown as GroceryItem);

      await service.removeGroceryItem("item_1", userId);

      expect(repo.deleteGroceryItem).toHaveBeenCalledWith("item_1", userId);
    });
  });

  describe("Shopping Lists", () => {
    it("should create a shopping list", async () => {
      const data: CreateShoppingListInput = { name: "Weekly List", items: [] };
      vi.mocked(repo.createShoppingList).mockResolvedValue({
        id: "list_1",
        userId,
        ...data,
      } as unknown as ShoppingList & { items: ShoppingListItem[] });

      const result = await service.createShoppingList(userId, data);

      expect(repo.createShoppingList).toHaveBeenCalledWith(userId, data);
      expect(result.id).toBe("list_1");
    });

    it("should get all shopping lists", async () => {
      const mockLists = [{ id: "list_1", name: "Weekly List" }];
      vi.mocked(repo.findShoppingLists).mockResolvedValue(mockLists as unknown as (ShoppingList & { items: ShoppingListItem[] })[]);

      const result = await service.getShoppingLists(userId);

      expect(repo.findShoppingLists).toHaveBeenCalledWith(userId);
      expect(result).toEqual(mockLists);
    });

    it("should get a single shopping list", async () => {
      const mockList = { id: "list_1", name: "Weekly List" };
      vi.mocked(repo.findShoppingListById).mockResolvedValue(mockList as unknown as ShoppingList & { items: ShoppingListItem[] });

      const result = await service.getShoppingList("list_1", userId);

      expect(repo.findShoppingListById).toHaveBeenCalledWith("list_1", userId);
      expect(result).toEqual(mockList);
    });

    it("should throw if getting non-existent shopping list", async () => {
      vi.mocked(repo.findShoppingListById).mockResolvedValue(null);

      await expect(service.getShoppingList("list_1", userId)).rejects.toThrow(
        "Shopping list not found",
      );
    });

    it("should update shopping list", async () => {
      const updateData = { name: "Updated Name" };
      vi.mocked(repo.findShoppingListById).mockResolvedValue({
        id: "list_1",
      } as unknown as ShoppingList & { items: ShoppingListItem[] });
      vi.mocked(repo.updateShoppingList).mockResolvedValue({
        id: "list_1",
        ...updateData,
      } as unknown as ShoppingList & { items: ShoppingListItem[] });

      const result = await service.updateShoppingList(
        "list_1",
        userId,
        updateData,
      );

      expect(repo.updateShoppingList).toHaveBeenCalledWith(
        "list_1",
        userId,
        updateData,
      );
      expect(result.name).toBe("Updated Name");
    });

    it("should delete shopping list", async () => {
      vi.mocked(repo.findShoppingListById).mockResolvedValue({
        id: "list_1",
      } as unknown as ShoppingList & { items: ShoppingListItem[] });
      vi.mocked(repo.deleteShoppingList).mockResolvedValue({
        id: "list_1",
      } as unknown as ShoppingList & { items: ShoppingListItem[] });

      await service.removeShoppingList("list_1", userId);

      expect(repo.deleteShoppingList).toHaveBeenCalledWith("list_1", userId);
    });
  describe("Meal Plans", () => {
    it("should create a meal plan", async () => {
      const data: CreateMealPlanInput = {
        startDate: new Date(),
        endDate: new Date(),
        meals: [],
      };
      vi.mocked(repo.createMealPlan).mockResolvedValue({
        id: "mp_1",
        userId,
        ...data,
      } as unknown as MealPlan & { meals: Meal[] });

      const result = await service.createMealPlan(userId, data);

      expect(repo.createMealPlan).toHaveBeenCalledWith(userId, data);
      expect(result.id).toBe("mp_1");
    });

    it("should get all meal plans", async () => {
      const mockPlans = [{ id: "mp_1" }];
      vi.mocked(repo.findMealPlans).mockResolvedValue(mockPlans as unknown as (MealPlan & { meals: Meal[] })[]);

      const result = await service.getMealPlans(userId);

      expect(repo.findMealPlans).toHaveBeenCalledWith(userId);
      expect(result).toEqual(mockPlans);
    });

    it("should get a single meal plan", async () => {
      const mockPlan = { id: "mp_1" };
      vi.mocked(repo.findMealPlanById).mockResolvedValue(mockPlan as unknown as MealPlan & { meals: Meal[] });

      const result = await service.getMealPlan("mp_1", userId);

      expect(repo.findMealPlanById).toHaveBeenCalledWith("mp_1", userId);
      expect(result).toEqual(mockPlan);
    });

    it("should throw AppError if getting non-existent meal plan", async () => {
      vi.mocked(repo.findMealPlanById).mockResolvedValue(null);

      await expect(service.getMealPlan("mp_1", userId)).rejects.toThrow(
        "Meal plan not found"
      );
    });

    it("should update meal plan", async () => {
      const updateData = { status: "ARCHIVED" as const };
      vi.mocked(repo.findMealPlanById).mockResolvedValue({
        id: "mp_1",
      } as unknown as MealPlan & { meals: Meal[] });
      vi.mocked(repo.updateMealPlan).mockResolvedValue({
        id: "mp_1",
        ...updateData,
      } as unknown as MealPlan & { meals: Meal[] });

      const result = await service.updateMealPlan(
        "mp_1",
        userId,
        updateData,
      );

      expect(repo.updateMealPlan).toHaveBeenCalledWith(
        "mp_1",
        userId,
        updateData,
      );
      expect(result.status).toBe("ARCHIVED");
    });

    it("should delete meal plan", async () => {
      vi.mocked(repo.findMealPlanById).mockResolvedValue({
        id: "mp_1",
      } as unknown as MealPlan & { meals: Meal[] });
      vi.mocked(repo.deleteMealPlan).mockResolvedValue({
        id: "mp_1",
      } as unknown as MealPlan & { meals: Meal[] });

      await service.removeMealPlan("mp_1", userId);

      expect(repo.deleteMealPlan).toHaveBeenCalledWith("mp_1", userId);
    });
  });
});
});
