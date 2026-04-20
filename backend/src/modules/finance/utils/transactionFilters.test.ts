import { describe, it, expect } from "vitest";
import { 
  getTypeConditions, 
  getCategoryConditions, 
  getDateConditions, 
  getSearchConditions, 
  buildTransactionQuery 
} from "./transactionFilters";

describe("transactionFilters", () => {
  describe("getTypeConditions", () => {
    it("should return empty object for ALL or no type", () => {
      expect(getTypeConditions("ALL")).toEqual({});
      expect(getTypeConditions()).toEqual({});
    });

    it("should return specific type conditions", () => {
      expect(getTypeConditions("INCOME")).toEqual({ type: "INCOME" });
      expect(getTypeConditions("EXPENSE")).toEqual({ type: "EXPENSE" });
    });

    it("should return correct conditions for linked entities", () => {
      expect(getTypeConditions("BILL")).toEqual({ billId: { not: null } });
      expect(getTypeConditions("BUDGET")).toEqual({ budgetId: { not: null } });
      expect(getTypeConditions("SAVING")).toEqual({ savingGoalId: { not: null } });
    });

    it("should handle UNBUDGETED edge case", () => {
      expect(getTypeConditions("UNBUDGETED")).toEqual({ 
        type: "EXPENSE", 
        budgetId: null 
      });
    });
  });

  describe("getCategoryConditions", () => {
    it("should return empty for ALL or empty string", () => {
      expect(getCategoryConditions("ALL")).toEqual({});
      expect(getCategoryConditions("")).toEqual({});
      expect(getCategoryConditions()).toEqual({});
    });

    it("should return categoryId condition", () => {
      expect(getCategoryConditions("cat_123")).toEqual({ categoryId: "cat_123" });
    });
  });

  describe("getDateConditions", () => {
    it("should handle fromDate only", () => {
      const from = "2024-01-01";
      const result = getDateConditions(from);
      expect(result.date.gte).toBeInstanceOf(Date);
      expect(result.date.gte?.toISOString()).toContain("2024-01-01T00:00:00");
    });

    it("should handle toDate with end of day normalization", () => {
      const to = "2024-01-01";
      const result = getDateConditions(undefined, to);
      const date = result.date.lte!;
      expect(date.getHours()).toBe(23);
      expect(date.getMinutes()).toBe(59);
      expect(date.getSeconds()).toBe(59);
      expect(date.getMilliseconds()).toBe(999);
    });

    it("should handle both dates", () => {
      const result = getDateConditions("2024-01-01", "2024-01-31");
      expect(result.date.gte).toBeDefined();
      expect(result.date.lte).toBeDefined();
    });
  });

  describe("getSearchConditions", () => {
    it("should return empty for no search term", () => {
      expect(getSearchConditions()).toEqual({});
      expect(getSearchConditions("")).toEqual({});
    });

    it("should return OR structure for search term", () => {
      const search = "Target";
      const result = getSearchConditions(search);
      expect(result.OR).toHaveLength(3);
      expect(result.OR[0].description.contains).toBe(search);
      expect(result.OR[1].category.name.mode).toBe("insensitive");
    });
  });

  describe("buildTransactionQuery", () => {
    it("should merge all conditions correctly", () => {
      const params = {
        type: "INCOME",
        categoryId: "cat_1",
        fromDate: "2024-01-01",
        search: "test"
      };
      const result = buildTransactionQuery(params);
      expect(result.type).toBe("INCOME");
      expect(result.categoryId).toBe("cat_1");
      expect(result.date).toBeDefined();
      expect(result.OR).toBeDefined();
    });
  });
});
