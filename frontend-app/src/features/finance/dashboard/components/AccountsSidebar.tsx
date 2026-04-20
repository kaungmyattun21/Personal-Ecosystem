import React, { useState, useEffect, memo } from "react";
import { Wallet, PieChart, Activity, TrendingUp, TrendingDown } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Account } from "@/types/finance";
import { cn } from "@/lib/utils";

/**
 * UTILS & TYPES
 */
interface AccountsSidebarProps {
  isLoading: boolean;
  accounts: Account[];
  currentMonthIncome: number;
  thisMonthExpense: number;
  netGain: number;
}

const formatCurrency = (amount: number) => 
  amount.toLocaleString(undefined, { 
    maximumFractionDigits: 2,
    minimumFractionDigits: 2 
  });

/**
 * SHARED SKELETON
 */
const SidebarSkeleton = ({ className, height }: { className?: string; height: string }) => (
  <div 
    className={cn("animate-pulse rounded-2xl bg-slate-100 dark:bg-white/5", className)} 
    style={{ height }}
  />
);

/**
 * 1. ACCOUNTS LIST CARD
 */
const AccountsListCard = memo(({ isLoading, accounts }: { isLoading: boolean; accounts: Account[] }) => (
  <Card className="relative overflow-hidden p-8 flex flex-col justify-between min-h-[320px] bg-white dark:bg-white/[0.05] border-none shadow-xl transition-all hover:scale-[1.01]">
    <div className="absolute inset-0 bg-gradient-to-tr from-brand-emerald/[0.02] to-transparent pointer-events-none" />
    <div className="relative z-10">
      <div className="flex items-center justify-between mb-8">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-emerald/10 text-brand-emerald border border-brand-emerald/5 shadow-inner">
          <Wallet size={24} strokeWidth={2} />
        </div>
        <span className="text-[8.5px] font-black uppercase tracking-[0.25em] text-brand-teal/50 dark:text-white/40">
          Portfolio
        </span>
      </div>
      
      <h3 className="text-[9px] font-black uppercase tracking-[0.25em] text-brand-teal/60 dark:text-white/60 mb-1">
        Linked Accounts
      </h3>
      
      {isLoading ? (
        <SidebarSkeleton height="52px" className="mt-2 w-32" />
      ) : (
        <div className="mt-2 flex items-baseline gap-2 text-brand-teal dark:text-white">
          <span className="text-[44px] font-black tracking-tighter leading-none">
            {accounts.length}
          </span>
          <span className="text-[9px] font-black uppercase tracking-widest opacity-60">
            Active
          </span>
        </div>
      )}
    </div>

    <div className="relative z-10 mt-8 space-y-1">
      {isLoading ? (
        Array.from({ length: 3 }).map((_, i) => (
          <SidebarSkeleton key={i} height="40px" className="mb-2" />
        ))
      ) : (
        accounts.slice(0, 3).map((account) => (
          <div key={account.id} className="flex items-center justify-between text-[10px] font-bold py-3 border-b border-black/[0.03] dark:border-white/5 uppercase tracking-wide text-brand-teal dark:text-white/80 last:border-0">
            <span className="truncate max-w-[120px]">{account.name}</span>
            <span className="bg-slate-50 dark:bg-white/5 px-3 py-1.5 rounded-xl tabular-nums text-brand-teal dark:text-white border border-black/[0.02] dark:border-white/[0.02]">
              ${formatCurrency(parseFloat(account.balance))}
            </span>
          </div>
        ))
      )}
    </div>
    
    <Wallet className="absolute -right-12 -top-12 text-brand-emerald/[0.03] dark:text-white/[0.02] w-64 h-64 pointer-events-none rotate-45" strokeWidth={0.5} />
  </Card>
));
AccountsListCard.displayName = "AccountsListCard";

/**
 * 2. BALANCE RATIO CARD
 */
const BalanceRatioCard = memo(({ isLoading, income, expense }: { isLoading: boolean; income: number; expense: number }) => {
  const ratio = income > 0 ? Math.round((expense / income) * 100) : 0;
  
  return (
    <Card className="p-8 flex flex-col justify-between min-h-[170px] group transition-all hover:shadow-lg">
      <div className="flex items-start justify-between mb-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-teal/5 text-brand-teal dark:bg-white/5 dark:text-white shadow-inner border border-black/[0.02] dark:border-white/5">
          <PieChart size={20} strokeWidth={2.5} />
        </div>
        <span className="text-[8px] font-black uppercase tracking-[0.25em] text-brand-teal/40 dark:text-white/40">
          Efficiency
        </span>
      </div>

      {isLoading ? (
        <SidebarSkeleton height="44px" className="w-full" />
      ) : (
        <div>
          <h3 className="text-[26px] font-black tracking-tighter text-brand-teal dark:text-white leading-none">
            {income > 0 ? `${ratio}%` : "0%"}
          </h3>
          <p className="mt-2 text-[8px] font-black uppercase tracking-[0.2em] text-brand-teal/50 dark:text-zinc-400">
            Spend Ratio • <span className="text-brand-emerald font-black">Monthly</span>
          </p>
        </div>
      )}
    </Card>
  );
});
BalanceRatioCard.displayName = "BalanceRatioCard";

/**
 * 3. BUDGET AI TIP (DEFERRED)
 */
const LowPriorityTip = memo(({ isLoading, netGain }: { isLoading: boolean; netGain: number }) => {
  const [isReady, setIsReady] = useState(false);

  // Defer rendering of the AI Tip to prioritize critical path elements
  useEffect(() => {
    const timer = setTimeout(() => setIsReady(true), 100);
    return () => clearTimeout(timer);
  }, []);

  if (!isReady) {
    return <SidebarSkeleton height="110px" className="w-full" />;
  }

  return (
    <Card className="p-8 border-none bg-slate-50/50 dark:bg-white/[0.02] backdrop-blur-sm animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex items-center gap-4 mb-5">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-emerald text-white shadow-xl shadow-brand-emerald/20">
          <Activity size={24} strokeWidth={2.5} />
        </div>
        <h4 className="text-[9px] font-black uppercase tracking-widest text-brand-emerald">
          Budget AI Tip
        </h4>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          <SidebarSkeleton height="14px" className="w-full" />
          <SidebarSkeleton height="14px" className="w-3/4" />
        </div>
      ) : (
        <p className="text-[11px] font-bold text-brand-teal/80 dark:text-zinc-300 leading-[1.6] uppercase italic tracking-tight">
          {netGain >= 0 
            ? `Performance is up! You've captured $${formatCurrency(netGain)} more surplus than last month. keep the momentum!`
            : `Surplus is $${formatCurrency(Math.abs(netGain))} lower vs last period. A quick audit of discretionary spending might be beneficial.`
          }
        </p>
      )}
    </Card>
  );
});
LowPriorityTip.displayName = "LowPriorityTip";

/**
 * MAIN COMPONENT
 */
export const AccountsSidebar = memo(({
  isLoading,
  accounts,
  currentMonthIncome,
  thisMonthExpense,
  netGain,
}: AccountsSidebarProps) => {
  return (
    <aside className="lg:col-span-4 flex flex-col gap-6" aria-label="Financial Summary Sidebar">
      <AccountsListCard isLoading={isLoading} accounts={accounts} />
      
      <BalanceRatioCard 
        isLoading={isLoading} 
        income={currentMonthIncome} 
        expense={thisMonthExpense} 
      />

      <LowPriorityTip isLoading={isLoading} netGain={netGain} />
    </aside>
  );
});
AccountsSidebar.displayName = "AccountsSidebar";
