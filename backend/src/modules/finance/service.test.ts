import { describe, it, expect, vi, beforeEach } from "vitest";
import * as service from "./service.js";
import * as repo from "./repository.js";

// Vitest will automatically use __mocks__/repository.ts
vi.mock("./repository.js");

describe("Finance Service", () => {
  const userId = "user_123";

  // Access the mocked repository methods with type safety
  const mockedRepo = vi.mocked(repo);

  // Define the mock transaction client that runInTransaction will provide
  const mockTx = {
    account: { findMany: vi.fn(), create: vi.fn(), update: vi.fn() },
    budget: { findMany: vi.fn(), update: vi.fn(), deleteMany: vi.fn() },
    transaction: { create: vi.fn(), update: vi.fn(), findFirst: vi.fn(), delete: vi.fn(), findMany: vi.fn(), deleteMany: vi.fn() },
    bill: { update: vi.fn() },
    savingGoal: { findFirst: vi.fn(), update: vi.fn() },
    savingContribution: { create: vi.fn() }
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockedRepo.runInTransaction.mockImplementation((cb: any) => cb(mockTx));
  });

  // --- Transactions ---
  describe("Transactions", () => {
    it("should create a transaction and update account balance", async () => {
      const data = { amount: 100, type: "INCOME", accountId: "acc_1" };
      mockedRepo.findAccountById.mockResolvedValue({ id: "acc_1", userId } as any);
      mockedRepo.createTransaction.mockResolvedValue({ id: "tx_1" } as any);

      await service.createTransaction(userId, data);

      expect(mockedRepo.createTransaction).toHaveBeenCalled();
      expect(mockedRepo.updateAccount).toHaveBeenCalledWith("acc_1", userId, expect.objectContaining({
        balance: { increment: 100 }
      }), mockTx);
    });

    it("should reject a transaction referencing an account the user does not own", async () => {
      const data = { amount: 100, type: "INCOME", accountId: "someone_elses_acc" };
      mockedRepo.findAccountById.mockResolvedValue(null);

      await expect(service.createTransaction(userId, data)).rejects.toThrow(
        "Account not found",
      );
      expect(mockedRepo.updateAccount).not.toHaveBeenCalled();
      expect(mockedRepo.createTransaction).not.toHaveBeenCalled();
    });

    it("should delete and recalculate account balance", async () => {
      const existingTx = { id: "tx_1", userId, amount: 100, type: "INCOME", accountId: "acc_1" };
      mockedRepo.findTransactionById.mockResolvedValue(existingTx as any);
      mockedRepo.findTransactions.mockResolvedValue([]);

      await service.deleteTransaction(userId, "tx_1");

      expect(mockedRepo.deleteTransaction).toHaveBeenCalledWith("tx_1", userId, mockTx);
      expect(mockedRepo.updateAccount).toHaveBeenCalledWith("acc_1", userId, { balance: 0 }, mockTx);
    });

    it("should reject reassigning a transaction to an account the user does not own", async () => {
      const existingTx = { id: "tx_1", userId, amount: 100, type: "INCOME", accountId: "acc_1" };
      mockedRepo.findTransactionById.mockResolvedValue(existingTx as any);
      mockedRepo.findAccountById.mockResolvedValue(null);

      await expect(
        service.updateTransaction(userId, "tx_1", { accountId: "someone_elses_acc" }),
      ).rejects.toThrow("Account not found");
      expect(mockedRepo.updateTransaction).not.toHaveBeenCalled();
    });
  });

  // --- Budgets ---
  describe("Budgets", () => {
    it("should validate parent limits when creating a sub-budget", async () => {
      const parent = { id: "p1", amount: 1000 };
      const siblings = [{ amount: 700 }];
      
      mockedRepo.findBudgetById.mockResolvedValue(parent as any);
      mockedRepo.findBudgetsByParentId.mockResolvedValue(siblings as any);

      const subBudgetData = { parentId: "p1", amount: 400 }; // 700 + 400 > 1000

      await expect(service.createBudget(userId, subBudgetData))
        .rejects.toThrow("Sub-budgets total limits cannot exceed parent budget limit");
    });

    it("should recursively calculate actual spent in getBudgets", async () => {
      const budgets = [
        { 
          id: "p1", 
          spent: 100, 
          subBudgets: [
            { id: "s1", spent: 50, subBudgets: [] }
          ] 
        }
      ];
      mockedRepo.findBudgetsByUserId.mockResolvedValue(budgets as any);

      const result = await service.getBudgets(userId);
      expect(result[0].actual).toBe(150); // 100 + 50
    });

    it("should bulk delete budgets within a transaction", async () => {
      await service.bulkDeleteBudgets(userId, ["b1", "b2"]);
      expect(mockedRepo.deleteBudgets).toHaveBeenCalledWith({ id: { in: ["b1", "b2"] }, userId }, mockTx);
    });
  });

  // --- Saving Goals ---
  describe("Saving Goals", () => {
    it("should update goal balance and status when a contribution is made", async () => {
      const goal = { id: "g1", currentAmount: 500, targetAmount: 1000, status: "IN_PROGRESS" };
      const contributionData = { savingGoalId: "g1", amount: 600 }; // 500 + 600 = 1100 (reached)

      mockedRepo.findSavingGoalById.mockResolvedValue(goal as any);
      mockedRepo.createSavingContribution.mockResolvedValue({ id: "c1" } as any);

      await service.createSavingContribution(userId, contributionData);

      expect(mockedRepo.updateSavingGoal).toHaveBeenCalledWith("g1", userId, expect.objectContaining({
        currentAmount: 1100,
        status: "REACHED"
      }), mockTx);
    });
  });

  // --- Bills ---
  describe("Bills", () => {
    it("should create a bill and normalize due date", async () => {
      const billData = { name: "Rent", dueDate: "2024-05-01" };
      mockedRepo.createBill.mockResolvedValue({ id: "b1" } as any);

      await service.createBill(userId, billData);
      expect(mockedRepo.createBill).toHaveBeenCalledWith(userId, expect.objectContaining({
        dueDate: expect.any(Date)
      }));
    });
  });
});
