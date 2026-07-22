import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BillSchedulerContext } from "../hooks/useBillSchedulerController";
import { BillRow } from "../components/BillRow";
import { BillSchedulerSkeleton } from "../components/BillSchedulerSkeleton";
import { DataLoadError } from "@/features/finance/shared/components/DataLoadError";

interface BillSchedulerViewProps extends BillSchedulerContext {
  limit?: number;
}

export function BillSchedulerView({
  bills,
  isLoading,
  isError,
  onEditBill,
  onToggleStatus,
  onAddBill,
  onSeeAll,
  limit,
}: BillSchedulerViewProps) {
  if (isLoading) return <BillSchedulerSkeleton />;
  if (isError) return <DataLoadError message="Couldn't load your bills." />;

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
          onClick={onSeeAll}
          className="text-[9px] font-black uppercase tracking-widest text-[#042727]/45 hover:text-[#10b981] transition-colors p-0 h-auto hover:bg-transparent"
        >
          See All
        </Button>
      </div>

      <div className="flex-1 space-y-3">
        {bills.length > 0 ? (
          bills.map((bill) => (
            <BillRow
              key={bill.id}
              bill={bill}
              onEdit={onEditBill}
              onToggleStatus={onToggleStatus}
            />
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-sm text-slate-500">No matching bills.</p>
          </div>
        )}
      </div>

      {!limit && (
        <Button
          onClick={onAddBill}
          className="w-full bg-[#042727] hover:bg-[#10b981] text-white rounded-full h-12 text-[10px] font-black uppercase tracking-widest shadow-none transition-all active:scale-95 border-none"
        >
          Add New Recurring Bill
        </Button>
      )}
    </Card>
  );
}
