"use client";

import React from "react";
import { Search, Bell } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

import { useSession } from "next-auth/react";

export function DashboardHeader() {
  const { data: session } = useSession();
  const userName = session?.user?.name?.split(" ")[0] ?? "Kaung";

  return (
    <header className="w-full bg-transparent transition-all duration-300">
      <div className="flex h-20 items-center justify-between px-4 md:px-8">
        <div className="flex flex-col gap-1">
          <h1 className="text-xl font-black tracking-tighter text-brand-teal dark:text-white uppercase italic leading-none">
            Hello, {userName}
          </h1>
          <p className="text-[10px] font-bold uppercase tracking-widest text-brand-teal-light dark:text-zinc-500 mt-0.5">
            Your Wealth Summary
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative group hidden md:block">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-teal-light dark:text-zinc-500 group-focus-within:text-brand-teal dark:group-focus-within:text-white transition-colors"
              strokeWidth={2.5}
            />
            <Input
              placeholder="Search analytics..."
              className="pl-11 h-10 w-64 lg:w-80 bg-slate-100 dark:bg-white/5 border-none rounded-2xl text-[12px] font-medium focus:ring-2 focus:ring-brand-teal/20 transition-all shadow-sm"
            />
          </div>

          <div className="flex items-center gap-1 bg-slate-100 dark:bg-zinc-800/40 p-1 rounded-xl">
            <button className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-white/50 dark:hover:bg-white/10 text-slate-500 dark:text-zinc-400 transition-all relative group">
              <Bell
                size={18}
                strokeWidth={2.5}
                className="group-hover:rotate-12 transition-transform"
              />
              <span className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-rose-500 border border-white dark:border-zinc-900" />
            </button>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
