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
import { AddSavingGoalForm } from "@/features/finance/goals/components/AddSavingGoalForm";
import { SavingGoalsTracker } from "@/features/finance/goals/components/SavingGoalsTracker";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Wallet, BarChart3, Receipt, Calendar, Target } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function FinanceView() {
  const dispatch = useDispatch();
  const activeTab = useSelector((state: RootState) => state.finance.activeTab);

  return (
    <div className="flex flex-col gap-6 pb-20 pt-2 lg:pb-10 max-w-7xl mx-auto w-full">
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
        className="w-full space-y-6"
      >
        <TabsList className="md:hidden flex items-center gap-0 border-b border-[#E8E8E8] dark:border-white/8 w-full bg-transparent p-0 rounded-none h-auto">
          {[
            { value: "overview",     icon: BarChart3, label: "Insights"  },
            { value: "transactions", icon: Wallet,    label: "Activity"  },
            { value: "budgets",      icon: Target,    label: "Budgets"   },
            { value: "bills",        icon: Receipt,   label: "Bills"     },
            { value: "goals",        icon: Calendar,  label: "Goals"     },
          ].map(({ value, icon: Icon, label }) => (
            <TabsTrigger
              key={value}
              value={value}
              className="
                flex items-center gap-1.5 px-4 pb-3 pt-1 text-sm font-semibold
                text-[#9CA3AF] dark:text-zinc-500
                hover:text-on-surface dark:hover:text-white
                border-b-2 border-transparent -mb-px
                data-[state=active]:border-on-surface dark:data-[state=active]:border-white
                data-[state=active]:text-on-surface dark:data-[state=active]:text-white
                transition-all duration-150 cursor-pointer
              "
            >
              <Icon size={14} strokeWidth={2.5} />
              <span className="hidden sm:inline">{label}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        <Suspense
          fallback={<Card className="h-96 w-full animate-pulse" />}
        >
          <TabsContent value="overview" className="space-y-8 outline-none">
            
            {activeTab === "overview" && (
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-7">
                <div className="md:col-span-1 lg:col-span-7">
                  <FinanceInsights />
                </div>
              </div>
            )}
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
