"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex h-full min-h-[60vh] flex-col items-center justify-center gap-6 px-6 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-rose-500/10 text-rose-500">
        <AlertTriangle className="h-8 w-8" strokeWidth={2} />
      </div>
      <div className="space-y-2">
        <h2 className="text-lg font-black uppercase tracking-tight text-[#042727] dark:text-white">
          Something went wrong
        </h2>
        <p className="max-w-sm text-sm text-slate-500 dark:text-zinc-400">
          We couldn&apos;t load this section. Please try again — if the problem
          persists, refresh the page.
        </p>
      </div>
      <Button
        onClick={reset}
        className="h-11 rounded-2xl bg-[#042727] px-8 text-[11px] font-black uppercase tracking-widest text-white hover:bg-[#10b981] dark:bg-white dark:text-[#042727]"
      >
        Try Again
      </Button>
    </div>
  );
}
