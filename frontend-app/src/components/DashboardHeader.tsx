"use client";

import React from "react";
import { Search, Bell } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

export function DashboardHeader() {
  return (
    <header className="w-full border-b border-[#E8E8E8] dark:border-white/5 bg-white dark:bg-brand-card-dark z-40">
      <div className="flex h-14 items-center justify-between px-6 md:px-8 gap-4">

        {/* Left — Search */}
        <div className="relative group flex-1 max-w-sm">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-teal-light group-focus-within:text-brand-emerald transition-colors pointer-events-none" strokeWidth={2} />
          <input
            type="text"
            placeholder="Search portfolios, assets, or markets..."
            className="w-full h-9 bg-brand-bg-light dark:bg-white/5 border-none rounded-full pl-10 pr-4 text-sm text-on-surface dark:text-white placeholder:text-brand-teal-light focus:outline-none focus:ring-2 focus:ring-brand-emerald/30 transition-all"
          />
        </div>

        {/* Right — Notification + Theme Toggle */}
        <div className="flex items-center gap-1">
          <button className="relative h-9 w-9 flex items-center justify-center rounded-full hover:bg-brand-bg-light dark:hover:bg-white/5 text-brand-teal-light hover:text-on-surface dark:hover:text-white transition-colors">
            <Bell size={18} strokeWidth={2} />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-[#ef4444] border-2 border-white dark:border-on-surface" />
          </button>
          <ThemeToggle />
        </div>

      </div>
    </header>
  );
}
