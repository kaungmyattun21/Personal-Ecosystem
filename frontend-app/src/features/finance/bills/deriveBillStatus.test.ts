import { describe, it, expect } from "vitest";
import {
  findLatestBillTransaction,
  resolveBillStatus,
  sortBillsByDueDate,
} from "./deriveBillStatus";
import { Bill } from "@/types/finance";

const now = new Date(2026, 2, 15, 12);

const bill = (over: Partial<Bill>) =>
  ({
    id: "b1",
    name: "Rent",
    amount: "1000",
    status: "UNPAID",
    dueDate: new Date(2026, 2, 20).toISOString(),
    ...over,
  }) as Bill;

describe("resolveBillStatus", () => {
  it("marks paid bills regardless of date", () => {
    const past = bill({ status: "PAID", dueDate: new Date(2020, 0, 1).toISOString() });
    expect(resolveBillStatus(past, now)).toEqual({ label: "Paid", tone: "emerald" });
  });

  it("marks a past due date as overdue", () => {
    const overdue = bill({ dueDate: new Date(2026, 2, 1).toISOString() });
    expect(resolveBillStatus(overdue, now)).toEqual({
      label: "Overdue",
      tone: "rose",
    });
  });

  it("treats a bill due today as upcoming, not overdue", () => {
    const today = bill({ dueDate: new Date(2026, 2, 15, 8).toISOString() });
    expect(resolveBillStatus(today, now).label).toBe("Upcoming");
  });

  it("marks bills inside the seven day window as upcoming", () => {
    const soon = bill({ dueDate: new Date(2026, 2, 18).toISOString() });
    expect(resolveBillStatus(soon, now)).toEqual({
      label: "Upcoming",
      tone: "amber",
    });
  });

  it("marks bills beyond the window as scheduled", () => {
    const later = bill({ dueDate: new Date(2026, 3, 30).toISOString() });
    expect(resolveBillStatus(later, now)).toEqual({
      label: "Scheduled",
      tone: "slate",
    });
  });
});

describe("sortBillsByDueDate", () => {
  it("orders bills by soonest due date", () => {
    const bills = [
      bill({ id: "late", dueDate: new Date(2026, 5, 1).toISOString() }),
      bill({ id: "early", dueDate: new Date(2026, 0, 1).toISOString() }),
      bill({ id: "mid", dueDate: new Date(2026, 3, 1).toISOString() }),
    ];

    expect(sortBillsByDueDate(bills).map((b) => b.id)).toEqual([
      "early",
      "mid",
      "late",
    ]);
  });

  it("applies the limit after sorting", () => {
    const bills = [
      bill({ id: "late", dueDate: new Date(2026, 5, 1).toISOString() }),
      bill({ id: "early", dueDate: new Date(2026, 0, 1).toISOString() }),
    ];

    expect(sortBillsByDueDate(bills, 1).map((b) => b.id)).toEqual(["early"]);
  });

  it("does not mutate the input array", () => {
    const bills = [
      bill({ id: "late", dueDate: new Date(2026, 5, 1).toISOString() }),
      bill({ id: "early", dueDate: new Date(2026, 0, 1).toISOString() }),
    ];

    sortBillsByDueDate(bills);
    expect(bills[0].id).toBe("late");
  });
});

describe("findLatestBillTransaction", () => {
  it("returns the most recent linked transaction", () => {
    const withTx = bill({
      transactions: [
        { id: "old", date: new Date(2026, 0, 1).toISOString() },
        { id: "newest", date: new Date(2026, 2, 1).toISOString() },
      ] as never,
    });

    expect(findLatestBillTransaction(withTx)?.id).toBe("newest");
  });

  it("returns undefined when there are no transactions", () => {
    expect(findLatestBillTransaction(bill({}))).toBeUndefined();
  });
});
