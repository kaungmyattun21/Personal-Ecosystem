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
      <aside className="hidden w-64 h-screen sticky top-0 flex-col border-r border-[#E8E8E8] dark:border-white/5 bg-white dark:bg-brand-card-dark md:flex z-50 transition-all duration-300">
        <div className="flex h-16 items-center px-6 mb-2">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-emerald text-white">
              <span className="font-black text-sm italic uppercase">B</span>
            </div>
            <div>
              <span className="text-sm font-black tracking-tight text-[#0A1A1A] dark:text-white uppercase">
                BudgetIt
              </span>
              <p className="text-[9px] font-semibold uppercase tracking-widest text-brand-teal-light dark:text-zinc-500 leading-none mt-0.5">
                Financial Intelligence
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col flex-1 overflow-y-auto">
          <nav className="flex-1 space-y-5 px-3">
            {/* Dashboard Link */}
            <div>
              <Link
                href="/dashboard"
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                  pathname === "/dashboard"
                    ? "bg-[#ECFDF5] dark:bg-brand-emerald/20 text-brand-emerald font-semibold"
                    : "text-brand-teal-light dark:text-zinc-400 hover:bg-brand-bg-light dark:hover:bg-white/5 hover:text-brand-teal dark:hover:text-white"
                }`}
              >
                <Home size={18} />
                <span>Overview</span>
              </Link>
            </div>

            {/* Finance Section */}
            <div className="space-y-0.5">
              <div className="px-3 pb-1 text-[10px] font-bold uppercase tracking-widest text-[#9CA3AF] dark:text-zinc-600">
                Finance
              </div>
              {financeSections.map((item) => {
                const isActive = pathname === "/dashboard/finance" && activeFinanceTab === item.tab;
                const Icon = item.icon;
                return (
                  <button
                    key={item.tab}
                    onClick={() => handleFinanceTabClick(item.tab)}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all cursor-pointer ${
                      isActive
                        ? "bg-[#ECFDF5] dark:bg-brand-emerald/20 text-brand-emerald font-semibold"
                        : "text-brand-teal-light dark:text-zinc-400 hover:bg-brand-bg-light dark:hover:bg-white/5 hover:text-brand-teal dark:hover:text-white"
                    }`}
                  >
                    <Icon size={18} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Kitchen Section */}
            <div className="space-y-0.5">
              <div className="px-3 pb-1 text-[10px] font-bold uppercase tracking-widest text-[#9CA3AF] dark:text-zinc-600">
                Kitchen
              </div>
              {kitchenSections.map((item) => {
                const isActive = pathname === "/dashboard/kitchen" && activeKitchenTab === item.tab;
                const Icon = item.icon;
                return (
                  <button
                    key={item.tab}
                    onClick={() => handleKitchenTabClick(item.tab)}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all cursor-pointer ${
                      isActive
                        ? "bg-[#ECFDF5] dark:bg-brand-emerald/20 text-brand-emerald font-semibold"
                        : "text-brand-teal-light dark:text-zinc-400 hover:bg-brand-bg-light dark:hover:bg-white/5 hover:text-brand-teal dark:hover:text-white"
                    }`}
                  >
                    <Icon size={18} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Health Section */}
            <div className="space-y-0.5">
              <div className="px-3 pb-1 text-[10px] font-bold uppercase tracking-widest text-[#9CA3AF] dark:text-zinc-600">
                Health
              </div>
              {healthSections.map((item) => {
                const isActive = pathname === "/dashboard/health" && activeHealthTab === item.tab;
                const Icon = item.icon;
                return (
                  <button
                    key={item.tab}
                    onClick={() => handleHealthTabClick(item.tab)}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all cursor-pointer ${
                      isActive
                        ? "bg-[#ECFDF5] dark:bg-brand-emerald/20 text-brand-emerald font-semibold"
                        : "text-brand-teal-light dark:text-zinc-400 hover:bg-brand-bg-light dark:hover:bg-white/5 hover:text-brand-teal dark:hover:text-white"
                    }`}
                  >
                    <Icon size={18} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </nav>

          <div className="p-3 mt-auto space-y-0.5 border-t border-[#E8E8E8] dark:border-white/5">
            <Link
              href="/dashboard/settings"
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                pathname === "/dashboard/settings"
                  ? "bg-[#ECFDF5] dark:bg-brand-emerald/20 text-brand-emerald font-semibold"
                  : "text-brand-teal-light dark:text-zinc-400 hover:bg-brand-bg-light dark:hover:bg-white/5 hover:text-brand-teal dark:hover:text-white"
              }`}
            >
              <Settings size={18} />
              <span>Settings</span>
            </Link>
            <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-brand-teal-light dark:text-zinc-400 transition-all hover:bg-[#FEF2F2] dark:hover:bg-white/5 hover:text-red-500 dark:hover:text-red-400">
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Bar (Floating Pill) */}
      <div className="fixed bottom-6 left-6 right-6 z-50 flex h-19 items-center justify-between border border-black/3 dark:border-white/5 bg-white dark:bg-brand-card-dark backdrop-blur-2xl rounded-[38px] shadow-[0_12px_45px_rgba(26,60,66,0.08)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.4)] px-6 md:hidden">
        {mobileNavItems.map((item) => {
          if (item.isAction) {
            return (
              <div
                key="action-fab"
                className="relative flex flex-col items-center justify-center w-auto h-full"
              >
                <button className="flex h-13 w-13 items-center justify-center rounded-full bg-brand-emerald text-white shadow-[0_8px_20px_rgba(10,176,139,0.35)] dark:shadow-[0_8px_20px_rgba(10,176,139,0.15)] transition-transform hover:scale-105 active:scale-95 border border-white/20">
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
              className={`flex flex-col items-center justify-center space-y-1 w-12 h-full transition-colors relative ${
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
