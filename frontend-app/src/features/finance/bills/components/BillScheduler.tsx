"use client";

import React, { useMemo } from "react";
import { format, isPast, isToday, addDays, isBefore } from "date-fns";
import { useBills } from "@/features/finance/bills/hooks/useBills";
import { useAccounts } from "@/features/finance/shared/hooks/useAccounts";
import { useTransactions } from "@/features/finance/transactions/hooks/useTransactions";
import { Bill } from "@/types/finance";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  CalendarCheck,
  Clock,
  AlertCircle,
  ChevronRight,
  Pencil,
} from "lucide-react";
import { useDispatch } from "react-redux";
import {
  setAddBillModalOpen,
  openEditBill,
  setActiveTab,
} from "@/lib/store/features/finance/finance-slice";

interface BillSchedulerProps {
  limit?: number;
}

export function BillScheduler({ limit }: BillSchedulerProps) {
  const dispatch = useDispatch();
  const { bills, updateBill } = useBills();
  const { accounts } = useAccounts();
  const { createTransaction, deleteTransaction } = useTransactions();

  const sortedBills = useMemo(() => {
    if (!bills.data) return [];

    return [...bills.data]
      .sort(
        (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime(),
      )
      .slice(0, limit || undefined);
  }, [bills.data, limit]);

  const handleToggleStatus = async (bill: Bill) => {
    try {
      if (bill.status === "PAID") {
        // Toggle PAID -> UNPAID: Find the last transaction created for this bill and delete it to restore balance
        const associatedTx = (bill.transactions ?? []).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
        
        if (associatedTx) {
          await deleteTransaction.mutateAsync(associatedTx.id);
        }
        
        // Final update to set status back (though transaction deletion might already trigger invalidation, let's be explicit)
        await updateBill.mutateAsync({ id: bill.id, data: { status: "UNPAID" as any } });
      } else {
        // Toggle UNPAID -> PAID: Create a transaction, which automatically marks the bill as PAID in backend
        const defaultAccountId = accounts.data?.[0]?.id;
        
        if (!defaultAccountId) {
          console.error("No account found to pay the bill.");
          return;
        }

        await createTransaction.mutateAsync({
          amount: parseFloat(bill.amount),
          type: "EXPENSE",
          description: `Bill Payment: ${bill.name}`,
          date: new Date().toISOString(),
          accountId: defaultAccountId,
          categoryId: bill.categoryId || undefined,
          billId: bill.id,
        } as any);
      }
    } catch (error) {
      console.error("Failed to update bill status:", error);
    }
  };

  const getBillStatus = (bill: Bill) => {
// ... same logic ...
    if (bill.status === "PAID")
      return { label: "Paid", color: "emerald", icon: CalendarCheck };

    const dueDate = new Date(bill.dueDate);
    const today = new Date();
    const upcomingThreshold = addDays(today, 7);

    if (isBefore(dueDate, today) && !isToday(dueDate)) {
      return { label: "Overdue", color: "rose", icon: AlertCircle };
    }

    if (isBefore(dueDate, upcomingThreshold)) {
      return { label: "Upcoming", color: "amber", icon: Clock };
    }

    return { label: "Scheduled", color: "slate", icon: Clock };
  };


  if (bills.isLoading) {
    return (
      <Card className="h-[400px] flex items-center justify-center animate-pulse">
        <p className="text-muted-foreground">Loading bills...</p>
      </Card>
    );
  }

  return (
    <Card className="h-full p-8 flex flex-col border-none bg-white dark:bg-zinc-900/50 shadow-[0_12px_32px_-4px_rgba(4,39,39,0.04)] rounded-[24px] gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-extrabold font-display uppercase tracking-tighter text-[#042727] dark:text-white">
            Upcoming Commitments
          </h3>
          <p className="text-[9px] font-bold uppercase tracking-widest text-[#042727]/60 dark:text-zinc-500 mt-1">
            Recurring Bills & Schedules
          </p>
        </div>
        <Button
          variant="ghost"
          onClick={() => dispatch(setActiveTab("bills"))}
          className="text-[9px] font-black uppercase tracking-widest text-[#042727]/45 hover:text-[#006b54] transition-colors p-0 h-auto hover:bg-transparent"
        >
          See All
        </Button>
      </div>

      <div className="flex-1 space-y-3">
        {sortedBills.length > 0 ? (
          sortedBills.map((bill) => {
            const status = getBillStatus(bill);
            const StatusIcon = status.icon;

            return (
              <div
                key={bill.id}
                className="group flex items-center justify-between py-4 border-b border-zinc-100 dark:border-white/5 last:border-none"
              >
                <div className="flex items-center gap-5">
                  <div
                    className={cn(
                      "flex h-11 w-11 items-center justify-center rounded-2xl transition-transform group-hover:scale-105 shadow-inner",
                      status.color === "emerald" &&
                        "bg-[#006b54]/10 text-[#006b54]",
                      status.color === "rose" && "bg-[#76001b]/10 text-[#76001b]",
                      status.color === "amber" &&
                        "bg-[#d39a3e]/10 text-[#d39a3e]",
                      status.color === "slate" &&
                        "bg-[#042727]/10 text-[#042727] dark:bg-white/5 dark:text-white",
                    )}
                  >
                    <StatusIcon className="h-5 w-5" strokeWidth={2.5} />
                  </div>
                  <div>
                    <p className="text-[13px] font-black uppercase tracking-tighter text-[#042727] dark:text-white leading-none mb-1">
                      {bill.name}
                    </p>
                    <p className="text-[8.5px] font-bold uppercase tracking-widest text-[#042727]/40 dark:text-zinc-550">
                      Due: {format(new Date(bill.dueDate), "MMM dd")} &bull; $
                      {parseFloat(bill.amount).toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div
                    className={cn(
                      "px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest italic",
                      status.color === "emerald" &&
                        "bg-[#006b54]/10 text-[#006b54]",
                      status.color === "rose" && "bg-[#76001b]/10 text-[#76001b]",
                      status.color === "amber" &&
                        "bg-[#d39a3e]/10 text-[#d39a3e]",
                      status.color === "slate" &&
                        "bg-[#042727]/10 text-[#042727] dark:bg-white/5 dark:text-white",
                    )}
                  >
                    {status.label}
                  </div>
                  
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      onClick={() => dispatch(openEditBill(bill.id))}
                      variant="ghost"
                      className="h-10 w-10 p-0 rounded-2xl hover:bg-black/5 dark:hover:bg-white/5"
                      title="Edit Bill"
                    >
                      <Pencil className="h-4 w-4 text-[#042727]/40 dark:text-white/40" />
                    </Button>
                    
                    <Button
                      onClick={() => handleToggleStatus(bill)}
                      variant="ghost"
                      className={cn(
                        "h-10 w-10 p-0 rounded-2xl hover:bg-black/5 dark:hover:bg-white/5",
                        bill.status === "PAID" ? "text-[#006b54]" : "text-[#042727]/40 dark:text-white/40"
                      )}
                      title={bill.status === "PAID" ? "Mark as Unpaid" : "Mark as Paid"}
                    >
                      <CalendarCheck className={cn("h-5 w-5", bill.status === "PAID" ? "opacity-100" : "opacity-40")} />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-8">
            <p className="text-sm text-slate-500">No matching bills.</p>
          </div>
        )}
      </div>

      {!limit && (
        <Button
          onClick={() => dispatch(setAddBillModalOpen(true))}
          className="w-full bg-[#042727] hover:bg-[#006b54] text-white rounded-full h-12 text-[10px] font-black uppercase tracking-widest shadow-none transition-all active:scale-95 border-none"
        >
          Add New Recurring Bill
        </Button>
      )}
    </Card>
  );
}
