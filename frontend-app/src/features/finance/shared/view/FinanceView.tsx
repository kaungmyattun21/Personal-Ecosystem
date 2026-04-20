"use client";

import { Suspense } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/lib/store/store";
import { setActiveTab } from "@/lib/store/features/finance/finance-slice";
import { FinanceHeader } from "@/features/finance/shared/components/FinanceHeader";
import { TransactionListView as TransactionList } from "@/features/finance/transactions";
import { BudgetTracker } from "@/features/finance/budgets/components/BudgetTracker";
import { BillScheduler } from "@/features/finance/bills/components/BillScheduler";
import { FinanceInsights } from "@/features/finance/insights/FinanceInsights";
import { ActionFAB } from "@/features/finance/shared/components/ActionFAB";
import { AddTransactionForm } from "@/features/finance/transactions/components/AddTransactionForm";
import { AddBudgetForm } from "@/features/finance/budgets/components/AddBudgetForm";
import { AddBillForm } from "@/features/finance/bills/components/AddBillForm";
import { AddSavingGoalForm } from "@/features/finance/goals/AddSavingGoalForm";
import { SavingGoalsTracker } from "@/features/finance/goals/components/SavingGoalsTracker";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Wallet, BarChart3, Receipt, Calendar, Target } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function FinanceView() {
  const dispatch = useDispatch();
  const activeTab = useSelector((state: RootState) => state.finance.activeTab);

  return (
    <div className="flex flex-col gap-8 pb-20 pt-2 lg:pb-10 max-w-7xl mx-auto w-full">
      <FinanceHeader />

      <Tabs
        value={activeTab}
        onValueChange={(value) =>
          dispatch(
            setActiveTab(
              value as
                | "overview"
                | "transactions"
                | "budgets"
                | "bills"
                | "goals",
            ),
          )
        }
        className="w-full space-y-8"
      >
        <div className="flex items-center justify-between">
          <TabsList className="bg-slate-100/50 dark:bg-white/5 p-1 rounded-2xl h-14 border border-black/[0.02] dark:border-white/[0.02] backdrop-blur-md">
            <TabsTrigger
              value="overview"
              className="px-6 rounded-xl data-[state=active]:bg-brand-teal data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-brand-teal/20 transition-all text-xs font-black uppercase tracking-widest gap-2 h-full"
            >
              <BarChart3 size={16} strokeWidth={2.5} />
              <span className="hidden sm:inline">Insights</span>
            </TabsTrigger>
            <TabsTrigger
              value="transactions"
              className="px-6 rounded-xl data-[state=active]:bg-brand-teal data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-brand-teal/20 transition-all text-xs font-black uppercase tracking-widest gap-2 h-full"
            >
              <Wallet size={16} strokeWidth={2.5} />
              <span className="hidden sm:inline">Activity</span>
            </TabsTrigger>
            <TabsTrigger
              value="budgets"
              className="px-6 rounded-xl data-[state=active]:bg-brand-teal data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-brand-teal/20 transition-all text-xs font-black uppercase tracking-widest gap-2 h-full"
            >
              <Target size={16} strokeWidth={2.5} />
              <span className="hidden sm:inline">Budgets</span>
            </TabsTrigger>
            <TabsTrigger
              value="bills"
              className="px-6 rounded-xl data-[state=active]:bg-brand-teal data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-brand-teal/20 transition-all text-xs font-black uppercase tracking-widest gap-2 h-full"
            >
              <Receipt size={16} strokeWidth={2.5} />
              <span className="hidden sm:inline">Bills</span>
            </TabsTrigger>
            <TabsTrigger
              value="goals"
              className="px-6 rounded-xl data-[state=active]:bg-brand-teal data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-brand-teal/20 transition-all text-xs font-black uppercase tracking-widest gap-2 h-full"
            >
              <Calendar size={16} strokeWidth={2.5} />
              <span className="hidden sm:inline">Goals</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <Suspense
          fallback={<Card className="h-[400px] w-full animate-pulse" />}
        >
          <TabsContent value="overview" className="space-y-8 outline-none">
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-7">
              <div className="md:col-span-1 lg:col-span-7">
                <FinanceInsights />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="transactions" className="outline-none space-y-6">
            <TransactionList />
          </TabsContent>

          <TabsContent value="budgets" className="outline-none space-y-6">
            <BudgetTracker />
          </TabsContent>

          <TabsContent value="bills" className="outline-none space-y-6">
            <BillScheduler />
          </TabsContent>

          <TabsContent value="goals" className="outline-none space-y-6">
            <SavingGoalsTracker />
          </TabsContent>
        </Suspense>
      </Tabs>

      <ActionFAB />
      <AddTransactionForm />
      <AddBudgetForm />
      <AddBillForm />
      <AddSavingGoalForm />
    </div>
  );
}
