"use client";

import { useCallback, useMemo } from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import {
  openEditBill,
  setActiveTab,
  setAddBillModalOpen,
} from "@/lib/store/features/finance/finance-slice";
import { Bill } from "@/types/finance";
import { useAccounts } from "@/features/finance/shared/hooks/useAccounts";
import { useTransactions } from "@/features/finance/transactions/hooks/useTransactions";
import { useBills } from "./useBills";
import { findLatestBillTransaction, sortBillsByDueDate } from "../deriveBillStatus";

export interface BillSchedulerContext {
  bills: Bill[];
  isLoading: boolean;
  onEditBill: (id: string) => void;
  onToggleStatus: (bill: Bill) => Promise<void>;
  onAddBill: () => void;
  onSeeAll: () => void;
}

export function useBillSchedulerController(limit?: number): BillSchedulerContext {
  const dispatch = useDispatch();
  const { bills, updateBill } = useBills();
  const { accounts } = useAccounts();
  const { createTransaction, deleteTransaction } = useTransactions();

  const sortedBills = useMemo(
    () => sortBillsByDueDate(bills.data ?? [], limit),
    [bills.data, limit],
  );

  const markUnpaid = useCallback(
    async (bill: Bill) => {
      const payment = findLatestBillTransaction(bill);
      if (payment) {
        await deleteTransaction.mutateAsync(payment.id);
      }
      await updateBill.mutateAsync({ id: bill.id, data: { status: "UNPAID" } });
    },
    [deleteTransaction, updateBill],
  );

  const markPaid = useCallback(
    async (bill: Bill) => {
      const defaultAccountId = accounts.data?.[0]?.id;

      if (!defaultAccountId) {
        toast.error("Add an account before paying a bill");
        return;
      }

      await createTransaction.mutateAsync({
        amount: parseFloat(bill.amount) as unknown as string,
        type: "EXPENSE",
        description: `Bill Payment: ${bill.name}`,
        date: new Date().toISOString(),
        accountId: defaultAccountId,
        categoryId: bill.categoryId || undefined,
        billId: bill.id,
      });
    },
    [accounts.data, createTransaction],
  );

  const onToggleStatus = useCallback(
    async (bill: Bill) => {
      try {
        if (bill.status === "PAID") {
          await markUnpaid(bill);
        } else {
          await markPaid(bill);
        }
      } catch {
        toast.error("Failed to update bill status");
      }
    },
    [markPaid, markUnpaid],
  );

  const onEditBill = useCallback(
    (id: string) => {
      dispatch(openEditBill(id));
    },
    [dispatch],
  );

  const onAddBill = useCallback(() => {
    dispatch(setAddBillModalOpen(true));
  }, [dispatch]);

  const onSeeAll = useCallback(() => {
    dispatch(setActiveTab("bills"));
  }, [dispatch]);

  return {
    bills: sortedBills,
    isLoading: bills.isPending,
    onEditBill,
    onToggleStatus,
    onAddBill,
    onSeeAll,
  };
}
