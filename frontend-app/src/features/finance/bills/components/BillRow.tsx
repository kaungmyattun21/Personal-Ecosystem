import { format } from "date-fns";
import { AlertCircle, CalendarCheck, Clock, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Bill } from "@/types/finance";
import { BillStatusTone, resolveBillStatus } from "../deriveBillStatus";

interface BillRowProps {
  bill: Bill;
  onEdit: (id: string) => void;
  onToggleStatus: (bill: Bill) => void;
}

const TONE_CLASS: Record<BillStatusTone, string> = {
  emerald: "bg-[#10b981]/10 text-[#10b981]",
  rose: "bg-[#ef4444]/10 text-[#ef4444]",
  amber: "bg-[#d39a3e]/10 text-[#d39a3e]",
  slate: "bg-[#042727]/10 text-[#042727] dark:bg-white/5 dark:text-white",
};

const TONE_ICON = {
  emerald: CalendarCheck,
  rose: AlertCircle,
  amber: Clock,
  slate: Clock,
} as const;

export function BillRow({ bill, onEdit, onToggleStatus }: BillRowProps) {
  const status = resolveBillStatus(bill);
  const StatusIcon = TONE_ICON[status.tone];
  const isPaid = bill.status === "PAID";

  return (
    <div className="group flex items-center justify-between py-4 border-b border-zinc-100 dark:border-white/5 last:border-none">
      <div className="flex items-center gap-5">
        <div
          className={cn(
            "flex h-11 w-11 items-center justify-center rounded-2xl transition-transform group-hover:scale-105 shadow-inner",
            TONE_CLASS[status.tone],
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
            TONE_CLASS[status.tone],
          )}
        >
          {status.label}
        </div>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            onClick={() => onEdit(bill.id)}
            variant="ghost"
            className="h-10 w-10 p-0 rounded-2xl hover:bg-black/5 dark:hover:bg-white/5"
            title="Edit Bill"
          >
            <Pencil className="h-4 w-4 text-[#042727]/40 dark:text-white/40" />
          </Button>

          <Button
            onClick={() => onToggleStatus(bill)}
            variant="ghost"
            className={cn(
              "h-10 w-10 p-0 rounded-2xl hover:bg-black/5 dark:hover:bg-white/5",
              isPaid ? "text-[#10b981]" : "text-[#042727]/40 dark:text-white/40",
            )}
            title={isPaid ? "Mark as Unpaid" : "Mark as Paid"}
          >
            <CalendarCheck
              className={cn("h-5 w-5", isPaid ? "opacity-100" : "opacity-40")}
            />
          </Button>
        </div>
      </div>
    </div>
  );
}
