import { describe, it, expect } from "vitest";
import {
  budgetLabel,
  resolveBudgetStatus,
  toBudgetProgress,
} from "./deriveBudgetProgress";
import { Budget } from "@/types/finance";

const budget = (over: Partial<Budget> & { actual?: number }) =>
  ({
    id: "b1",
    amount: "1000",
    period: "MONTHLY",
    ...over,
  }) as Budget & { actual?: number };

describe("resolveBudgetStatus", () => {
  it.each([
    [0, "safe"],
    [79.9, "safe"],
    [80, "warning"],
    [99.9, "warning"],
    [100, "critical"],
    [150, "critical"],
  ])("maps %i%% to %s", (percentage, expected) => {
    expect(resolveBudgetStatus(percentage)).toBe(expected);
  });
});

describe("toBudgetProgress", () => {
  it("computes percentage from actual against amount", () => {
    const result = toBudgetProgress(budget({ amount: "200", actual: 50 }));

    expect(result.actual).toBe(50);
    expect(result.percentage).toBe(25);
    expect(result.status).toBe("safe");
  });

  it("defaults a missing actual to zero", () => {
    expect(toBudgetProgress(budget({ amount: "500" })).actual).toBe(0);
  });

  it("avoids dividing by a zero amount", () => {
    const result = toBudgetProgress(budget({ amount: "0", actual: 100 }));

    expect(result.percentage).toBe(0);
    expect(result.status).toBe("safe");
  });

  it("flags overspend as critical", () => {
    const result = toBudgetProgress(budget({ amount: "100", actual: 130 }));

    expect(result.percentage).toBe(130);
    expect(result.status).toBe("critical");
  });

  it("derives progress for nested sub-budgets", () => {
    const result = toBudgetProgress(
      budget({
        amount: "1000",
        actual: 100,
        subBudgets: [
          budget({ id: "child", amount: "100", actual: 90 }),
        ] as Budget[],
      }),
    );

    expect(result.subBudgets?.[0].percentage).toBe(90);
    expect(result.subBudgets?.[0].status).toBe("warning");
  });
});

describe("budgetLabel", () => {
  it("prefers the budget name", () => {
    expect(budgetLabel(budget({ name: "Groceries" }))).toBe("Groceries");
  });

  it("falls back to the category name", () => {
    expect(
      budgetLabel(budget({ name: null, category: { name: "Food" } as never })),
    ).toBe("Food");
  });

  it("falls back to a generic label", () => {
    expect(budgetLabel(budget({ name: null }))).toBe("Budget");
  });
});
