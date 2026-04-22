import { describe, it, expect, vi, beforeEach } from "vitest";
import * as service from "./service.js";
import * as repo from "./repository.js";

vi.mock("./repository.js");

describe("Kitchen Service", () => {
  const userId = "user_123";

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Grocery Items", () => {
    it("should add a single grocery item", async () => {
      const data: any = { name: "Apple", quantity: 5 };
      vi.mocked(repo.createGroceryItem).mockResolvedValue({ id: "item_1", userId, ...data } as any);

      const result = await service.addGroceryItem(userId, data);

      expect(repo.createGroceryItem).toHaveBeenCalledWith(userId, data);
      expect(result.id).toBe("item_1");
    });

    it("should add multiple grocery items", async () => {
      const dataArray: any[] = [
        { name: "Apple", quantity: 5 },
        { name: "Banana", quantity: 10 }
      ];
      vi.mocked(repo.createMultipleGroceryItems).mockResolvedValue({ count: 2 } as any);

      const result = await service.addMultipleGroceryItems(userId, dataArray);

      expect(repo.createMultipleGroceryItems).toHaveBeenCalledWith(userId, dataArray);
      expect(result.count).toBe(2);
    });

    it("should fail to add empty array of grocery items", async () => {
      await expect(service.addMultipleGroceryItems(userId, []))
        .rejects.toThrow("Cannot create empty array of grocery items");
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

      await expect(service.getGroceryItem("item_1", userId))
        .rejects.toThrow("Grocery item not found");
    });

    it("should update grocery item", async () => {
      const updateData = { quantity: 10 };
      vi.mocked(repo.findGroceryItemById).mockResolvedValue({ id: "item_1" } as any);
      vi.mocked(repo.updateGroceryItem).mockResolvedValue({ id: "item_1", ...updateData } as any);

      const result = await service.updateGroceryItem("item_1", userId, updateData);

      expect(repo.updateGroceryItem).toHaveBeenCalledWith("item_1", userId, updateData);
      expect(result.quantity).toBe(10);
    });

    it("should delete grocery item", async () => {
      vi.mocked(repo.findGroceryItemById).mockResolvedValue({ id: "item_1" } as any);
      vi.mocked(repo.deleteGroceryItem).mockResolvedValue({ id: "item_1" } as any);

      await service.removeGroceryItem("item_1", userId);

      expect(repo.deleteGroceryItem).toHaveBeenCalledWith("item_1", userId);
    });
  });
});
