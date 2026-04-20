import React from "react";
import { Sidebar } from "@/components/Sidebar";
import { DashboardHeader } from "@/components/DashboardHeader";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-brand-bg-light dark:bg-brand-bg-dark text-brand-teal dark:text-white selection:bg-brand-emerald/30 transition-colors duration-300 font-sans overflow-hidden">
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col relative overflow-hidden">
        <DashboardHeader />
        
        {/* Background ambient light */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.7)_0%,transparent_60%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.5)_0%,transparent_60%)] dark:bg-[radial-gradient(circle_at_top_right,rgba(10,176,139,0.15)_0%,transparent_60%)] mix-blend-overlay opacity-80" />

        <main className="flex-1 overflow-y-auto z-10 p-4 md:p-8 md:pb-8 pb-[120px]">
          {children}
        </main>
      </div>
    </div>
  );
}
