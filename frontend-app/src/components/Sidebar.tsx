"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";
import { setActiveTab as setFinanceTab } from "@/lib/store/features/finance/finance-slice";
import { setActiveTab as setKitchenTab } from "@/lib/store/features/kitchen/kitchen-slice";
import { setActiveTab as setHealthTab } from "@/lib/store/features/health/health-slice";
import {
  Home,
  Wallet,
  Settings,
  LogOut,
  Refrigerator,
  Plus,
  Activity,
  BarChart3,
  Target,
  Receipt,
  Calendar,
  LayoutDashboard,
  Package,
  ShoppingCart,
  Utensils,
  Dumbbell,
  Heart,
} from "lucide-react";

const mobileNavItems = [
  { href: "/dashboard", icon: Home, label: "Dashboard" },
  { href: "/dashboard/finance", icon: Wallet, label: "Finance" },
  { isAction: true, label: "Add" }, // Center Add Button placeholder
  {
    href: "/dashboard/kitchen",
    icon: Refrigerator,
    label: "Kitchen",
  },
  { href: "/dashboard/health", icon: Activity, label: "Health" },
];

const financeSections = [
  { tab: "overview", label: "Insights", icon: BarChart3 },
  { tab: "transactions", label: "Activity", icon: Wallet },
  { tab: "budgets", label: "Budgets", icon: Target },
  { tab: "bills", label: "Bills", icon: Receipt },
  { tab: "goals", label: "Goals", icon: Calendar },
] as const;

const kitchenSections = [
  { tab: "overview", label: "Overview", icon: LayoutDashboard },
  { tab: "groceries", label: "Groceries", icon: Package },
  { tab: "shopping-list", label: "Shopping List", icon: ShoppingCart },
  { tab: "meal-plan", label: "Meal Plan", icon: Utensils },
] as const;

const healthSections = [
  { tab: "overview", label: "Overview", icon: Activity },
  { tab: "workouts", label: "Workouts", icon: Dumbbell },
  { tab: "metrics", label: "Metrics", icon: Heart },
] as const;

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();

  const activeFinanceTab = useSelector((state: RootState) => state.finance.activeTab);
  const activeKitchenTab = useSelector((state: RootState) => state.kitchen.activeTab);
  const activeHealthTab = useSelector((state: RootState) => state.health.activeTab);

  const handleFinanceTabClick = (tab: typeof financeSections[number]["tab"]) => {
    dispatch(setFinanceTab(tab));
    if (pathname !== "/dashboard/finance") {
      router.push("/dashboard/finance");
    }
  };

  const handleKitchenTabClick = (tab: typeof kitchenSections[number]["tab"]) => {
    dispatch(setKitchenTab(tab));
    if (pathname !== "/dashboard/kitchen") {
      router.push("/dashboard/kitchen");
    }
  };

  const handleHealthTabClick = (tab: typeof healthSections[number]["tab"]) => {
    dispatch(setHealthTab(tab));
    if (pathname !== "/dashboard/health") {
      router.push("/dashboard/health");
    }
  };

  return (
    <>
      {/* Sidebar - Desktop */}
      <aside className="hidden w-64 h-screen sticky top-0 flex-col border-r border-black/[0.03] dark:border-white/[0.05] bg-white dark:bg-brand-card-dark md:flex z-50 transition-all duration-300">
        <div className="flex h-20 items-center px-8 mb-4 mt-2">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-emerald shadow-[0_4px_20px_rgba(10,176,139,0.3)] text-white">
              <span className="font-black text-xl italic uppercase">B</span>
            </div>
            <span className="text-xl font-black tracking-tighter text-brand-teal dark:text-white uppercase italic">
              BudgetIt
            </span>
          </div>
        </div>

        <div className="flex flex-col flex-1 overflow-y-auto">
          <nav className="flex-1 space-y-6 px-4">
            {/* Dashboard Link */}
            <div>
              <Link
                href="/dashboard"
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                  pathname === "/dashboard"
                    ? "bg-brand-emerald-light dark:bg-brand-emerald/20 text-brand-emerald"
                    : "text-brand-teal-light dark:text-zinc-400 hover:bg-black/5 dark:hover:bg-white/5 hover:text-brand-teal dark:hover:text-white"
                }`}
              >
                <Home size={20} />
                <span>Dashboard</span>
              </Link>
            </div>

            {/* Finance Section */}
            <div className="space-y-1">
              <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-650 opacity-70">
                Finance
              </div>
              <div className="space-y-1">
                {financeSections.map((item) => {
                  const isActive = pathname === "/dashboard/finance" && activeFinanceTab === item.tab;
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.tab}
                      onClick={() => handleFinanceTabClick(item.tab)}
                      className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all cursor-pointer ${
                        isActive
                          ? "bg-brand-emerald-light dark:bg-brand-emerald/20 text-brand-emerald"
                          : "text-brand-teal-light dark:text-zinc-400 hover:bg-black/5 dark:hover:bg-white/5 hover:text-brand-teal dark:hover:text-white"
                      }`}
                    >
                      <Icon size={20} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Kitchen Section */}
            <div className="space-y-1">
              <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-650 opacity-70">
                Kitchen
              </div>
              <div className="space-y-1">
                {kitchenSections.map((item) => {
                  const isActive = pathname === "/dashboard/kitchen" && activeKitchenTab === item.tab;
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.tab}
                      onClick={() => handleKitchenTabClick(item.tab)}
                      className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all cursor-pointer ${
                        isActive
                          ? "bg-brand-emerald-light dark:bg-brand-emerald/20 text-brand-emerald"
                          : "text-brand-teal-light dark:text-zinc-400 hover:bg-black/5 dark:hover:bg-white/5 hover:text-brand-teal dark:hover:text-white"
                      }`}
                    >
                      <Icon size={20} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Health Section */}
            <div className="space-y-1">
              <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-650 opacity-70">
                Health
              </div>
              <div className="space-y-1">
                {healthSections.map((item) => {
                  const isActive = pathname === "/dashboard/health" && activeHealthTab === item.tab;
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.tab}
                      onClick={() => handleHealthTabClick(item.tab)}
                      className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all cursor-pointer ${
                        isActive
                          ? "bg-brand-emerald-light dark:bg-brand-emerald/20 text-brand-emerald"
                          : "text-brand-teal-light dark:text-zinc-400 hover:bg-black/5 dark:hover:bg-white/5 hover:text-brand-teal dark:hover:text-white"
                      }`}
                    >
                      <Icon size={20} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </nav>

          <div className="p-4 mt-auto space-y-2">
            <Link
              href="/dashboard/settings"
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                pathname === "/dashboard/settings"
                  ? "bg-brand-emerald-light dark:bg-brand-emerald/20 text-brand-emerald"
                  : "text-brand-teal-light dark:text-zinc-400 hover:bg-black/5 dark:hover:bg-white/5 hover:text-brand-teal dark:hover:text-white"
              }`}
            >
              <Settings size={20} />
              <span>Settings</span>
            </Link>
            <button className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-zinc-650 dark:text-zinc-400 transition-all hover:bg-black/5 dark:hover:bg-white/5 hover:text-red-500 dark:hover:text-red-400">
              <LogOut size={20} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Bar (Floating Pill) */}
      <div className="fixed bottom-6 left-6 right-6 z-50 flex h-[76px] items-center justify-between border border-black/[0.03] dark:border-white/[0.05] bg-white dark:bg-brand-card-dark backdrop-blur-2xl rounded-[38px] shadow-[0_12px_45px_rgba(26,60,66,0.08)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.4)] px-6 md:hidden">
        {mobileNavItems.map((item) => {
          if (item.isAction) {
            return (
              <div
                key="action-fab"
                className="relative flex flex-col items-center justify-center w-auto h-full"
              >
                <button className="flex h-[52px] w-[52px] items-center justify-center rounded-full bg-brand-emerald text-white shadow-[0_8px_20px_rgba(10,176,139,0.35)] dark:shadow-[0_8px_20px_rgba(10,176,139,0.15)] transition-transform hover:scale-105 active:scale-95 border border-white/20">
                  <Plus strokeWidth={2.5} size={28} />
                </button>
              </div>
            );
          }

          const isActive = pathname === item.href;
          const Icon = item.icon!;
          return (
            <Link
              key={item.href}
              href={item.href!}
              className={`flex flex-col items-center justify-center space-y-1 w-[48px] h-full transition-colors relative ${
                isActive
                  ? "text-brand-teal dark:text-white"
                  : "text-brand-teal-light/70 hover:text-brand-teal dark:text-zinc-500 dark:hover:text-zinc-300"
              }`}
            >
              <Icon
                size={24}
                strokeWidth={isActive ? 2.5 : 2}
                className="relative z-10"
              />
              {/* Active Dot Indicator */}
              {isActive && (
                <div className="absolute -bottom-1 h-1 w-1 rounded-full bg-brand-teal dark:bg-white" />
              )}
            </Link>
          );
        })}
      </div>
    </>
  );
}
