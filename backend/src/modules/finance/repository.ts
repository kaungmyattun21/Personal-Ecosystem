import { Prisma } from "@prisma/client";
import { prisma } from "../../shared/db.js";

// --- Accounts ---
export async function createAccount(userId: string, data: any, tx?: any) {
  const db = tx || prisma;
  return db.account.create({
    data: { ...data, userId },
  });
}

export async function findAccountsByUserId(userId: string, tx?: any) {
  const db = tx || prisma;
  return db.account.findMany({
    where: { userId },
    orderBy: { createdAt: "asc" },
  });
}

export async function findAccountById(id: string, userId: string, tx?: any) {
  const db = tx || prisma;
  return db.account.findFirst({
    where: { id, userId },
  });
}

export async function updateAccount(id: string, userId: string, data: any, tx?: any) {
  const db = tx || prisma;
  return db.account.updateMany({
    where: { id, userId },
    data,
  });
}

export async function deleteAccount(id: string, userId: string, tx?: any) {
  const db = tx || prisma;
  return db.account.deleteMany({
    where: { id, userId },
  });
}

// --- Categories ---
export async function createCategory(userId: string, data: any, tx?: any) {
  const db = tx || prisma;
  return db.category.create({
    data: { ...data, userId },
  });
}

export async function findCategoriesByUserId(userId: string, tx?: any) {
  const db = tx || prisma;
  return db.category.findMany({
    where: { userId },
    orderBy: { name: "asc" },
  });
}

export async function findCategoryById(id: string, userId: string, tx?: any) {
  const db = tx || prisma;
  return db.category.findFirst({
    where: { id, userId },
  });
}

export async function updateCategory(id: string, userId: string, data: any, tx?: any) {
  const db = tx || prisma;
  return db.category.updateMany({
    where: { id, userId },
    data,
  });
}

export async function deleteCategory(id: string, userId: string, tx?: any) {
  const db = tx || prisma;
  return db.category.deleteMany({
    where: { id, userId },
  });
}

// --- Transactions ---
export async function createTransaction(userId: string, data: any, tx?: any) {
  const db = tx || prisma;
  return db.transaction.create({
    data: { ...data, userId },
  });
}

export async function findTransactionsByUserId(
  userId: string,
  filterConditions: Prisma.TransactionWhereInput = {},
  tx?: any
) {
  const db = tx || prisma;
  return db.transaction.findMany({
    where: { ...filterConditions, userId },
    include: {
      account: true,
      category: true,
      bill: true,
    },
    orderBy: { date: "desc" },
  });
}

export async function findTransactionById(id: string, userId: string, tx?: any) {
  const db = tx || prisma;
  return db.transaction.findFirst({
    where: { id, userId },
    include: {
      account: true,
      category: true,
      bill: true,
    },
  });
}

export async function findTransactions(conditions: Prisma.TransactionWhereInput, tx?: any) {
  const db = tx || prisma;
  return db.transaction.findMany({
    where: conditions,
  });
}

export async function updateTransaction(id: string, userId: string, data: any, tx?: any) {
  const db = tx || prisma;
  return db.transaction.updateMany({
    where: { id, userId },
    data,
  });
}

export async function deleteTransaction(id: string, userId: string, tx?: any) {
  const db = tx || prisma;
  return db.transaction.deleteMany({
    where: { id, userId },
  });
}

export async function deleteTransactions(conditions: Prisma.TransactionWhereInput, tx?: any) {
  const db = tx || prisma;
  return db.transaction.deleteMany({
    where: conditions,
  });
}

// --- Budgets ---
export async function createBudget(userId: string, data: any, tx?: any) {
  const db = tx || prisma;
  return db.budget.create({
    data: { ...data, userId },
  });
}

export async function findBudgetsByUserId(userId: string, tx?: any) {
  const db = tx || prisma;
  return db.budget.findMany({
    where: { userId, parentId: null },
    include: {
      category: true,
      subBudgets: {
        include: { category: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function findBudgetById(id: string, userId: string, tx?: any) {
  const db = tx || prisma;
  return db.budget.findFirst({
    where: { id, userId },
    include: {
      category: true,
      subBudgets: true,
    },
  });
}

export async function findBudgets(conditions: Prisma.BudgetWhereInput, tx?: any) {
  const db = tx || prisma;
  return db.budget.findMany({
    where: conditions,
    include: { category: true },
  });
}

export async function updateBudget(id: string, userId: string, data: any, tx?: any) {
  const db = tx || prisma;
  return db.budget.updateMany({
    where: { id, userId },
    data,
  });
}

export async function deleteBudget(id: string, userId: string, tx?: any) {
  const db = tx || prisma;
  return db.budget.deleteMany({
    where: { id, userId },
  });
}

export async function deleteBudgets(conditions: Prisma.BudgetWhereInput, tx?: any) {
  const db = tx || prisma;
  return db.budget.deleteMany({
    where: conditions,
  });
}

export async function findBudgetsByParentId(
  userId: string,
  parentId: string | null,
  tx?: any
) {
  const db = tx || prisma;
  return db.budget.findMany({
    where: { userId, parentId },
    include: { category: true },
  });
}

// --- Bills ---
export async function createBill(userId: string, data: any, tx?: any) {
  const db = tx || prisma;
  return db.bill.create({
    data: { ...data, userId },
  });
}

export async function findBillsByUserId(userId: string, tx?: any) {
  const db = tx || prisma;
  return db.bill.findMany({
    where: { userId },
    include: { category: true, transactions: true },
    orderBy: { dueDate: "asc" },
  });
}

export async function findBillById(id: string, userId: string, tx?: any) {
  const db = tx || prisma;
  return db.bill.findFirst({
    where: { id, userId },
  });
}

export async function updateBill(id: string, userId: string, data: any, tx?: any) {
  const db = tx || prisma;
  return db.bill.updateMany({
    where: { id, userId },
    data,
  });
}

export async function deleteBill(id: string, userId: string, tx?: any) {
  const db = tx || prisma;
  return db.bill.deleteMany({
    where: { id, userId },
  });
}

// --- Savings Goals ---
export async function createSavingGoal(userId: string, data: any, tx?: any) {
  const db = tx || prisma;
  return db.savingGoal.create({
    data: { ...data, userId },
  });
}

export async function findSavingGoalsByUserId(userId: string, tx?: any) {
  const db = tx || prisma;
  return db.savingGoal.findMany({
    where: { userId },
    include: { contributions: { orderBy: { date: "desc" } } },
    orderBy: { createdAt: "desc" },
  });
}

export async function findSavingGoalById(id: string, userId: string, tx?: any) {
  const db = tx || prisma;
  return db.savingGoal.findFirst({
    where: { id, userId },
    include: { contributions: { orderBy: { date: "desc" } } },
  });
}

export async function updateSavingGoal(id: string, userId: string, data: any, tx?: any) {
  const db = tx || prisma;
  return db.savingGoal.updateMany({
    where: { id, userId },
    data,
  });
}

export async function deleteSavingGoal(id: string, userId: string, tx?: any) {
  const db = tx || prisma;
  return db.savingGoal.deleteMany({
    where: { id, userId },
  });
}

// --- Saving Contributions ---
export async function createSavingContribution(data: any, tx?: any) {
  const db = tx || prisma;
  return db.savingContribution.create({
    data,
  });
}

export async function findSavingContributionsByGoalId(savingGoalId: string, tx?: any) {
  const db = tx || prisma;
  return db.savingContribution.findMany({
    where: { savingGoalId },
    orderBy: { date: "desc" },
  });
}

/**
 * Executes a function within a Prisma transaction.
 * Useful for business logic that spans multiple record updates.
 */
export async function runInTransaction<T>(
  callback: (tx: any) => Promise<T>,
): Promise<T> {
  return prisma.$transaction(callback);
}
