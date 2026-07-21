import { Card } from "@/components/ui/card";

export function BudgetTrackerSkeleton() {
  return (
    <Card className="p-8 flex flex-col gap-6 border-none bg-white dark:bg-zinc-900/50 rounded-[24px]">
      <div className="h-5 w-32 rounded-full bg-slate-200 dark:bg-white/10 animate-pulse" />
      {[0, 1, 2].map((row) => (
        <div key={row} className="space-y-2 animate-pulse">
          <div className="flex justify-between">
            <div className="h-3 w-28 rounded-full bg-slate-200 dark:bg-white/10" />
            <div className="h-3 w-16 rounded-full bg-slate-200 dark:bg-white/10" />
          </div>
          <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-white/5" />
        </div>
      ))}
    </Card>
  );
}
