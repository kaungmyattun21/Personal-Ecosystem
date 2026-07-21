import { describe, it, expect } from "vitest";
import {
  buildCashflowSeries,
  buildCategoryBreakdown,
  calculateSpendableCash,
  splitCurrency,
  sumAccountBalances,
  sumGoalContributions,
  sumSlices,
} from "./deriveInsights";
import { Account, SavingGoal, Transaction } from "@/types/finance";

const tx = (over: Partial<Transaction>) =>
  ({
    id: "t1",
    amount: "100",
    type: "EXPENSE",
    date: "2026-03-15T00:00:00.000Z",
    ...over,
  }) as Transaction;

describe("sumAccountBalances", () => {
  it("adds decimal string balances", () => {
    const accounts = [{ balance: "100.50" }, { balance: "25.25" }] as Account[];
    expect(sumAccountBalances(accounts)).toBe(125.75);
  });

  it("is zero for no accounts", () => {
    expect(sumAccountBalances([])).toBe(0);
  });
});

describe("sumGoalContributions", () => {
  it("adds current amounts", () => {
    const goals = [{ currentAmount: "300" }, { currentAmount: "200" }] as SavingGoal[];
    expect(sumGoalContributions(goals)).toBe(500);
  });
});

describe("calculateSpendableCash", () => {
  it("subtracts savings from balance", () => {
    expect(calculateSpendableCash(1000, 400)).toBe(600);
  });

  it("never goes negative when savings exceed balance", () => {
    expect(calculateSpendableCash(100, 400)).toBe(0);
  });
});

describe("splitCurrency", () => {
  it("splits into integer and decimal parts", () => {
    expect(splitCurrency(1234.5)).toEqual({
      integerPart: "1,234",
      decimalPart: "50",
    });
  });
});

describe("buildCategoryBreakdown", () => {
  it("groups expenses by category and sorts descending", () => {
    const transactions = [
      tx({ amount: "50", category: { name: "Food" } as never }),
      tx({ amount: "30", category: { name: "Food" } as never }),
      tx({ amount: "200", category: { name: "Rent" } as never }),
    ];

    expect(buildCategoryBreakdown(transactions)).toEqual([
      { name: "Rent", value: 200 },
      { name: "Food", value: 80 },
    ]);
  });

  it("ignores income and labels missing categories", () => {
    const transactions = [
      tx({ amount: "500", type: "INCOME", category: { name: "Salary" } as never }),
      tx({ amount: "40" }),
    ];

    expect(buildCategoryBreakdown(transactions)).toEqual([
      { name: "Uncategorized", value: 40 },
    ]);
  });

  it("caps the result at the given limit", () => {
    const transactions = ["a", "b", "c", "d", "e", "f"].map((name, i) =>
      tx({ amount: String((i + 1) * 10), category: { name } as never }),
    );

    expect(buildCategoryBreakdown(transactions, 5)).toHaveLength(5);
  });
});

describe("sumSlices", () => {
  it("totals slice values", () => {
    expect(sumSlices([{ name: "a", value: 10 }, { name: "b", value: 5 }])).toBe(15);
  });
});

describe("buildCashflowSeries", () => {
  const now = new Date("2026-03-15T12:00:00.000Z");

  it("returns one point per day of the current month", () => {
    const series = buildCashflowSeries([], "daily", now);
    expect(series).toHaveLength(31); // March
    expect(series[0].date).toBe("01");
  });

  const localNoon = (year: number, month: number, day: number) =>
    new Date(year, month, day, 12).toISOString();

  it("buckets income and expense into the matching day", () => {
    const transactions = [
      tx({ amount: "500", type: "INCOME", date: localNoon(2026, 2, 15) }),
      tx({ amount: "120", type: "EXPENSE", date: localNoon(2026, 2, 15) }),
    ];

    const series = buildCashflowSeries(transactions, "daily", now);
    const march15 = series.find((point) => point.date === "15");

    expect(march15).toEqual({ date: "15", income: 500, expense: 120 });
  });

  it("returns six buckets for weekly and monthly", () => {
    expect(buildCashflowSeries([], "weekly", now)).toHaveLength(6);
    expect(buildCashflowSeries([], "monthly", now)).toHaveLength(6);
  });

  it("ends the monthly series on the current month", () => {
    const series = buildCashflowSeries([], "monthly", now);
    expect(series[series.length - 1].date).toBe("Mar");
    expect(series[0].date).toBe("Oct");
  });

  it("excludes transactions outside the window", () => {
    const transactions = [
      tx({ amount: "999", type: "INCOME", date: "2025-01-01T00:00:00.000Z" }),
    ];

    const series = buildCashflowSeries(transactions, "monthly", now);
    expect(series.every((point) => point.income === 0)).toBe(true);
  });

  it("treats negative amounts by magnitude", () => {
    const transactions = [
      tx({ amount: "-75", type: "EXPENSE", date: localNoon(2026, 2, 15) }),
    ];

    const series = buildCashflowSeries(transactions, "daily", now);
    expect(series.find((point) => point.date === "15")?.expense).toBe(75);
  });
});
