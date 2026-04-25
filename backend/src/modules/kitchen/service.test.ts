import { describe, it, expect, vi, beforeEach } from "vitest";
import * as service from "./service.js";
import * as repo from "./repository.js";
import {
  CreateGroceryItemInput,
  UpdateGroceryItemInput,
  CreateShoppingListInput,
  UpdateShoppingListInput,
} from "./types.js";
import { GroceryItem, ShoppingList } from "@prisma/client";

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
      } as any);

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
      } as any);

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
      vi.mocked(repo.findGroceryItems).mockResolvedValue(mockItems as any);

      const result = await service.getGroceryItems(userId);

      expect(repo.findGroceryItems).toHaveBeenCalledWith(userId);
      expect(result).toEqual(mockItems);
    });

    it("should get a single grocery item", async () => {
      const mockItem = { id: "item_1", name: "Apple" };
      vi.mocked(repo.findGroceryItemById).mockResolvedValue(mockItem as any);

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
      } as any);
      vi.mocked(repo.updateGroceryItem).mockResolvedValue({
        id: "item_1",
        ...updateData,
      } as any);

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
      } as any);
      vi.mocked(repo.deleteGroceryItem).mockResolvedValue({
        id: "item_1",
      } as any);

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
      } as any);

      const result = await service.createShoppingList(userId, data);

      expect(repo.createShoppingList).toHaveBeenCalledWith(userId, data);
      expect(result.id).toBe("list_1");
    });

    it("should get all shopping lists", async () => {
      const mockLists = [{ id: "list_1", name: "Weekly List" }];
      vi.mocked(repo.findShoppingLists).mockResolvedValue(mockLists as any);

      const result = await service.getShoppingLists(userId);

      expect(repo.findShoppingLists).toHaveBeenCalledWith(userId);
      expect(result).toEqual(mockLists);
    });

    it("should get a single shopping list", async () => {
      const mockList = { id: "list_1", name: "Weekly List" };
      vi.mocked(repo.findShoppingListById).mockResolvedValue(mockList as any);

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
      } as any);
      vi.mocked(repo.updateShoppingList).mockResolvedValue({
        id: "list_1",
        ...updateData,
      } as any);

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
      } as any);
      vi.mocked(repo.deleteShoppingList).mockResolvedValue({
        id: "list_1",
      } as any);

      await service.removeShoppingList("list_1", userId);

      expect(repo.deleteShoppingList).toHaveBeenCalledWith("list_1", userId);
    });
  });
});
