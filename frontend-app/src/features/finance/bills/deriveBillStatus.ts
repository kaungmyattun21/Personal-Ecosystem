import { addDays, isBefore, isSameDay } from "date-fns";
import { Bill } from "@/types/finance";

export type BillStatusTone = "emerald" | "rose" | "amber" | "slate";

export type BillStatusLabel = "Paid" | "Overdue" | "Upcoming" | "Scheduled";

export interface BillStatus {
  label: BillStatusLabel;
  tone: BillStatusTone;
}

const UPCOMING_WINDOW_DAYS = 7;

export function resolveBillStatus(bill: Bill, now: Date = new Date()): BillStatus {
  if (bill.status === "PAID") {
    return { label: "Paid", tone: "emerald" };
  }

  const dueDate = new Date(bill.dueDate);

  if (isBefore(dueDate, now) && !isSameDay(dueDate, now)) {
    return { label: "Overdue", tone: "rose" };
  }

  if (isBefore(dueDate, addDays(now, UPCOMING_WINDOW_DAYS))) {
    return { label: "Upcoming", tone: "amber" };
  }

  return { label: "Scheduled", tone: "slate" };
}

export function sortBillsByDueDate(bills: Bill[], limit?: number): Bill[] {
  const sorted = [...bills].sort(
    (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime(),
  );

  return limit ? sorted.slice(0, limit) : sorted;
}

export function findLatestBillTransaction(bill: Bill) {
  return [...(bill.transactions ?? [])].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  )[0];
}
