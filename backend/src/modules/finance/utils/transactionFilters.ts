import { Prisma } from "@prisma/client";
import { TransactionFilterParams } from "../types.js";

export function getTypeConditions(type?: string): Prisma.TransactionWhereInput {
  if (!type || type === "ALL") return {};

  switch (type) {
    case "INCOME":
      return { type: "INCOME" };
    case "EXPENSE":
      return { type: "EXPENSE" };
    case "BILL":
      return { billId: { not: null } };
    case "BUDGET":
      return { budgetId: { not: null } };
    case "SAVING":
      return { savingGoalId: { not: null } };
    case "UNBUDGETED":
      return { type: "EXPENSE", budgetId: null };
    default:
      return {};
  }
}

export function getCategoryConditions(
  categoryId?: string,
): Prisma.TransactionWhereInput {
  if (!categoryId || categoryId === "ALL" || categoryId === "") return {};
  return { categoryId };
}

export function getDateConditions(
  fromDate?: string | Date,
  toDate?: string | Date,
): Prisma.TransactionWhereInput {
  if (!fromDate && !toDate) return {};

  const dateCondition: Prisma.DateTimeFilter = {};

  if (fromDate) {
    dateCondition.gte = new Date(fromDate);
  }

  if (toDate) {
    const end = new Date(toDate);
    end.setHours(23, 59, 59, 999);
    dateCondition.lte = end;
  }

  return { date: dateCondition };
}

export function getSearchConditions(
  search?: string,
): Prisma.TransactionWhereInput {
  if (!search) return {};

  return {
    OR: [
      { description: { contains: search, mode: "insensitive" } },
      { category: { name: { contains: search, mode: "insensitive" } } },
      { account: { name: { contains: search, mode: "insensitive" } } },
    ],
  };
}

export function buildTransactionQuery(
  searchParams: TransactionFilterParams,
): Prisma.TransactionWhereInput {
  return {
    ...getTypeConditions(searchParams.type),
    ...getCategoryConditions(searchParams.categoryId),
    ...getDateConditions(searchParams.fromDate, searchParams.toDate),
    ...getSearchConditions(searchParams.search),
  };
}
