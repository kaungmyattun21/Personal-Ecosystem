import { AlertTriangle } from "lucide-react";
import { Card } from "@/components/ui/card";

interface DataLoadErrorProps {
  message?: string;
}

export function DataLoadError({ message }: DataLoadErrorProps) {
  return (
    <Card className="p-8 flex flex-col items-center justify-center gap-3 border-none bg-white dark:bg-zinc-900/50 rounded-[24px] min-h-[200px] text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-500">
        <AlertTriangle className="h-6 w-6" strokeWidth={2} />
      </div>
      <p className="text-[12px] font-black uppercase tracking-widest text-slate-600 dark:text-zinc-300">
        Couldn&apos;t load data
      </p>
      <p className="text-[11px] text-slate-400 dark:text-zinc-500">
        {message || "Check your connection and try again."}
      </p>
    </Card>
  );
}
