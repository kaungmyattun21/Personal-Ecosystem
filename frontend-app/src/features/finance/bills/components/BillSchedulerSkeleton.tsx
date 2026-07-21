import { Card } from "@/components/ui/card";

export function BillSchedulerSkeleton() {
  return (
    <Card className="p-8 flex flex-col gap-6 border-none bg-white dark:bg-zinc-900/50 rounded-[24px]">
      <div className="h-5 w-32 rounded-full bg-slate-200 dark:bg-white/10 animate-pulse" />
      {[0, 1, 2, 3].map((row) => (
        <div key={row} className="flex items-center gap-4 animate-pulse">
          <div className="h-10 w-10 rounded-xl bg-slate-200 dark:bg-white/10 shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-3 w-32 rounded-full bg-slate-200 dark:bg-white/10" />
            <div className="h-2 w-20 rounded-full bg-slate-100 dark:bg-white/5" />
          </div>
          <div className="h-4 w-16 rounded-full bg-slate-200 dark:bg-white/10" />
        </div>
      ))}
    </Card>
  );
}
