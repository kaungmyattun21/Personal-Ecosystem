import { describe, it, expect, vi, beforeEach } from "vitest";
import * as repository from "./repository.js";
import { prisma } from "../../shared/db.js";
import {
  CreateGroceryItemInput,
  CreateShoppingListInput,
  UpdateGroceryItemInput,
  UpdateShoppingListInput,
} from "./types.js";
import { GroceryItem, ShoppingList, ShoppingListItem } from "@prisma/client";

vi.mock("../../shared/db.js", () => {
  return {
    prisma: {
      groceryItem: {
        create: vi.fn(),
        createMany: vi.fn(),
        findMany: vi.fn(),
        findUnique: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
      },
      shoppingList: {
        create: vi.fn(),
        findMany: vi.fn(),
        findUnique: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
      },
      shoppingListItem: {
        create: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
        deleteMany: vi.fn(),
      },
      $transaction: vi.fn((callback) =>
        callback({
          groceryItem: {
            create: vi.fn(),
          },
          shoppingList: {
            create: vi.fn(),
            update: vi.fn(),
          },
          shoppingListItem: {
            create: vi.fn(),
            update: vi.fn(),
            deleteMany: vi.fn(),
          },
        }),
      ),
    },
  };
});

describe("Kitchen Repository", () => {
  const userId = "user_123";

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should create a single grocery item", async () => {
    const data: CreateGroceryItemInput = {
      name: "Apple",
      quantity: 5,
      category: "Produce",
      image: "img.jpg",
      unit: "kg",
      status: "AVAILABLE",
    };
    const mockCreated = {
      id: "item_1",
      userId,
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
      expiryDate: null,
      status: "AVAILABLE",
    };

    vi.mocked(prisma.groceryItem.create).mockResolvedValue(
      mockCreated as GroceryItem,
    );

    const result = await repository.createGroceryItem(userId, data);

    expect(prisma.groceryItem.create).toHaveBeenCalledWith({
      data: {
        userId,
        ...data,
      },
    });
    expect(result).toEqual(mockCreated);
  });

  it("should create multiple grocery items", async () => {
    const dataArray: CreateGroceryItemInput[] = [
      { name: "Apple", quantity: 5, status: "AVAILABLE" },
      { name: "Banana", quantity: 10, status: "AVAILABLE" },
    ];

    vi.mocked(prisma.groceryItem.createMany).mockResolvedValue({ count: 2 });

    const result = await repository.createMultipleGroceryItems(
      userId,
      dataArray,
    );

    expect(prisma.groceryItem.createMany).toHaveBeenCalledWith({
      data: [
        { userId, ...dataArray[0] },
        { userId, ...dataArray[1] },
      ],
    });
    expect(result.count).toBe(2);
  });

  it("should find grocery items by user", async () => {
    const mockItems = [
      { id: "item_1", name: "Apple", userId },
    ] as GroceryItem[];
    vi.mocked(prisma.groceryItem.findMany).mockResolvedValue(mockItems);

    const result = await repository.findGroceryItems(userId);

    expect(prisma.groceryItem.findMany).toHaveBeenCalledWith({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
    expect(result).toEqual(mockItems);
  });

  it("should find grocery item by id", async () => {
    const mockItem = { id: "item_1", name: "Apple", userId } as GroceryItem;
    vi.mocked(prisma.groceryItem.findUnique).mockResolvedValue(mockItem);

    const result = await repository.findGroceryItemById("item_1", userId);

    expect(prisma.groceryItem.findUnique).toHaveBeenCalledWith({
      where: { id: "item_1", userId },
    });
    expect(result).toEqual(mockItem);
  });

  it("should update grocery item", async () => {
    const updateData: UpdateGroceryItemInput = { quantity: 10 };
    const mockUpdated = { id: "item_1", userId, ...updateData } as GroceryItem;
    vi.mocked(prisma.groceryItem.update).mockResolvedValue(mockUpdated);

    const result = await repository.updateGroceryItem(
      "item_1",
      userId,
      updateData,
    );

    expect(prisma.groceryItem.update).toHaveBeenCalledWith({
      where: { id: "item_1", userId },
      data: updateData,
    });
    expect(result).toEqual(mockUpdated);
  });

  it("should delete grocery item", async () => {
    const mockDeleted = { id: "item_1", userId } as GroceryItem;
    vi.mocked(prisma.groceryItem.delete).mockResolvedValue(mockDeleted);

    const result = await repository.deleteGroceryItem("item_1", userId);

    expect(prisma.groceryItem.delete).toHaveBeenCalledWith({
      where: { id: "item_1", userId },
    });
    expect(result).toEqual(mockDeleted);
  });

  describe("Shopping List", () => {
    it("should create a shopping list with items", async () => {
      const data: CreateShoppingListInput = {
        name: "Weekly Groceries",
        items: [
          { name: "Milk", quantity: 2, unit: "L" },
          { name: "Bread", quantity: 1, unit: null },
        ],
      };
      const mockCreated = {
        id: "list_1",
        userId,
        name: data.name,
        estimatedCost: 0,
        status: "ACTIVE",
        createdAt: new Date(),
        updatedAt: new Date(),
        items: data.items?.map((item, index) => ({
          id: `item_${index}`,
          shoppingListId: "list_1",
          isCompleted: false,
          completedAt: null,
          createdAt: new Date(),
          updatedAt: new Date(),
          groceryItemId: null,
          category: null,
          image: null,
          notes: null,
          ...item,
        })),
      };

      vi.mocked(prisma.shoppingList.create).mockResolvedValue(
        mockCreated as any,
      );

      const result = await repository.createShoppingList(userId, data);

      expect(prisma.shoppingList.create).toHaveBeenCalledWith({
        data: {
          userId,
          name: data.name,
          items: {
            create: data.items,
          },
        },
        include: { items: true },
      });
      expect(result).toEqual(mockCreated);
    });

    it("should find shopping lists by user", async () => {
      const mockLists = [
        { id: "list_1", name: "Weekly Groceries", items: [], userId },
      ] as any[];
      vi.mocked(prisma.shoppingList.findMany).mockResolvedValue(mockLists);

      const result = await repository.findShoppingLists(userId);

      expect(prisma.shoppingList.findMany).toHaveBeenCalledWith({
        where: { userId },
        include: { items: true },
        orderBy: { createdAt: "desc" },
      });
      expect(result).toEqual(mockLists);
    });

    it("should find shopping list by id", async () => {
      const mockList = {
        id: "list_1",
        name: "Weekly Groceries",
        items: [],
        userId,
      } as any;
      vi.mocked(prisma.shoppingList.findUnique).mockResolvedValue(mockList);

      const result = await repository.findShoppingListById("list_1", userId);

      expect(prisma.shoppingList.findUnique).toHaveBeenCalledWith({
        where: { id: "list_1", userId },
        include: { items: true },
      });
      expect(result).toEqual(mockList);
    });

    it("should update shopping list", async () => {
      const updateData: UpdateShoppingListInput = { name: "Updated List" };
      const mockUpdated = { id: "list_1", userId, ...updateData } as any;
      vi.mocked(prisma.shoppingList.update).mockResolvedValue(mockUpdated);

      const result = await repository.updateShoppingList(
        "list_1",
        userId,
        updateData,
      );

      expect(prisma.shoppingList.update).toHaveBeenCalledWith({
        where: { id: "list_1", userId },
        data: { name: updateData.name },
        include: { items: true },
      });
      expect(result).toEqual(mockUpdated);
    });

    it("should delete shopping list", async () => {
      const mockDeleted = { id: "list_1", userId } as any;
      vi.mocked(prisma.shoppingList.delete).mockResolvedValue(mockDeleted);

      const result = await repository.deleteShoppingList("list_1", userId);

      expect(prisma.shoppingList.delete).toHaveBeenCalledWith({
        where: { id: "list_1", userId },
      });
      expect(result).toEqual(mockDeleted);
    });
  });
});
