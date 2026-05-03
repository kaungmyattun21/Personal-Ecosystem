"use client";

import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/lib/store/store";
import { setActiveTab } from "@/lib/store/features/kitchen/kitchen-slice";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GroceriesView } from "@/features/kitchen/groceries/view/GroceriesView";
import { ShoppingListView } from "@/features/kitchen/shopping-list/view/ShoppingListView";
import { MealPlanView } from "@/features/kitchen/meal-plan/view/MealPlanView";
import { ShoppingCart, Utensils, Package, LayoutDashboard } from "lucide-react";
import { Suspense } from "react";
import { Card } from "@/components/ui/card";
import { KitchenOverview } from "@/features/kitchen/overview/view/KitchenOverview";
import { KitchenHeader } from "@/features/kitchen/shared/components/KitchenHeader";
import { AddGroceryForm } from "@/features/kitchen/groceries/components/AddGroceryForm";
import { AddShoppingListForm } from "@/features/kitchen/shopping-list/components/AddShoppingListForm";
import { AddMealPlanForm } from "@/features/kitchen/meal-plan/components/AddMealPlanForm";
import { BulkAddGroceryForm } from "@/features/kitchen/groceries/components/BulkAddGroceryForm";

export function KitchenView() {
  const dispatch = useDispatch();
  const activeTab = useSelector((state: RootState) => state.kitchen.activeTab);

  return (
    <div className="flex flex-col gap-8 pb-20 pt-2 lg:pb-10 max-w-7xl mx-auto w-full p-6">
      <KitchenHeader />

      <Tabs
        value={activeTab}
        onValueChange={(value) =>
          dispatch(setActiveTab(value as "overview" | "groceries" | "shopping-list" | "meal-plan"))
        }
        className="w-full space-y-8"
      >
        <div className="flex items-center justify-between">
          <TabsList className="bg-slate-100/50 dark:bg-white/5 p-1 rounded-2xl h-14 border border-black/[0.02] dark:border-white/[0.02] backdrop-blur-md">
            <TabsTrigger
              value="overview"
              className="px-6 rounded-xl data-[state=active]:bg-brand-teal data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-brand-teal/20 transition-all text-xs font-black uppercase tracking-widest gap-2 h-full"
            >
              <LayoutDashboard size={16} strokeWidth={2.5} />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger
              value="groceries"
              className="px-6 rounded-xl data-[state=active]:bg-brand-teal data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-brand-teal/20 transition-all text-xs font-black uppercase tracking-widest gap-2 h-full"
            >
              <Package size={16} strokeWidth={2.5} />
              <span className="hidden sm:inline">Groceries</span>
            </TabsTrigger>
            <TabsTrigger
              value="shopping-list"
              className="px-6 rounded-xl data-[state=active]:bg-brand-teal data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-brand-teal/20 transition-all text-xs font-black uppercase tracking-widest gap-2 h-full"
            >
              <ShoppingCart size={16} strokeWidth={2.5} />
              <span className="hidden sm:inline">Shopping List</span>
            </TabsTrigger>
            <TabsTrigger
              value="meal-plan"
              className="px-6 rounded-xl data-[state=active]:bg-brand-teal data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-brand-teal/20 transition-all text-xs font-black uppercase tracking-widest gap-2 h-full"
            >
              <Utensils size={16} strokeWidth={2.5} />
              <span className="hidden sm:inline">Meal Plan</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <Suspense fallback={<Card className="h-[400px] w-full animate-pulse" />}>
          <TabsContent value="overview" className="space-y-4 outline-none">
            <KitchenOverview />
          </TabsContent>
          <TabsContent value="groceries" className="space-y-4 outline-none">
            <GroceriesView />
          </TabsContent>
          <TabsContent value="shopping-list" className="space-y-4 outline-none">
            <ShoppingListView />
          </TabsContent>
          <TabsContent value="meal-plan" className="space-y-4 outline-none">
            <MealPlanView />
          </TabsContent>
        </Suspense>
      </Tabs>

      <AddGroceryForm />
      <BulkAddGroceryForm />
      <AddShoppingListForm />
      <AddMealPlanForm />
    </div>
  );
}
