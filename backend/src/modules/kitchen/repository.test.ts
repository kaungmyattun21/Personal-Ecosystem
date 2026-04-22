import { describe, it, expect, vi, beforeEach } from "vitest";
import * as repository from "./repository.js";
import { prisma } from "../../shared/db.js";

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
      $transaction: vi.fn((callback) => callback({
        groceryItem: {
          create: vi.fn(),
        }
      }))
    }
  };
});

describe("Kitchen Repository", () => {
  const userId = "user_123";

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should create a single grocery item", async () => {
    const data: any = { name: "Apple", quantity: 5, category: "Produce", image: "img.jpg", unit: "kg" };
    const mockCreated = { id: "item_1", userId, ...data };
    
    vi.mocked(prisma.groceryItem.create).mockResolvedValue(mockCreated as any);
    
    const result = await repository.createGroceryItem(userId, data);
    
    expect(prisma.groceryItem.create).toHaveBeenCalledWith({
      data: {
        userId,
        ...data
      }
    });
    expect(result).toEqual(mockCreated);
  });

  it("should create multiple grocery items", async () => {
    const dataArray: any[] = [
      { name: "Apple", quantity: 5 },
      { name: "Banana", quantity: 10 }
    ];
    
    vi.mocked(prisma.groceryItem.createMany).mockResolvedValue({ count: 2 });
    
    const result = await repository.createMultipleGroceryItems(userId, dataArray);
    
    expect(prisma.groceryItem.createMany).toHaveBeenCalledWith({
      data: [
        { userId, ...dataArray[0] },
        { userId, ...dataArray[1] }
      ]
    });
    expect(result.count).toBe(2);
  });

  it("should find grocery items by user", async () => {
    const mockItems = [{ id: "item_1", name: "Apple" }];
    vi.mocked(prisma.groceryItem.findMany).mockResolvedValue(mockItems as any);
    
    const result = await repository.findGroceryItems(userId);
    
    expect(prisma.groceryItem.findMany).toHaveBeenCalledWith({
      where: { userId },
      orderBy: { createdAt: "desc" }
    });
    expect(result).toEqual(mockItems);
  });

  it("should find grocery item by id", async () => {
    const mockItem = { id: "item_1", name: "Apple" };
    vi.mocked(prisma.groceryItem.findUnique).mockResolvedValue(mockItem as any);
    
    const result = await repository.findGroceryItemById("item_1", userId);
    
    expect(prisma.groceryItem.findUnique).toHaveBeenCalledWith({
      where: { id: "item_1", userId }
    });
    expect(result).toEqual(mockItem);
  });

  it("should update grocery item", async () => {
    const updateData = { quantity: 10 };
    const mockUpdated = { id: "item_1", ...updateData };
    vi.mocked(prisma.groceryItem.update).mockResolvedValue(mockUpdated as any);
    
    const result = await repository.updateGroceryItem("item_1", userId, updateData);
    
    expect(prisma.groceryItem.update).toHaveBeenCalledWith({
      where: { id: "item_1", userId },
      data: updateData
    });
    expect(result).toEqual(mockUpdated);
  });

  it("should delete grocery item", async () => {
    const mockDeleted = { id: "item_1" };
    vi.mocked(prisma.groceryItem.delete).mockResolvedValue(mockDeleted as any);
    
    const result = await repository.deleteGroceryItem("item_1", userId);
    
    expect(prisma.groceryItem.delete).toHaveBeenCalledWith({
      where: { id: "item_1", userId }
    });
    expect(result).toEqual(mockDeleted);
  });
});
