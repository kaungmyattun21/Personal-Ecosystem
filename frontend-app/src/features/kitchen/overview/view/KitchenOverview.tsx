"use client";

import { useKitchenOverviewController } from "@/features/kitchen/shared/hooks/useKitchenOverviewController";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, AlertTriangle, ShoppingCart, Utensils, DollarSign, Loader2 } from "lucide-react";

export function KitchenOverview() {
  const { stats, isLoading } = useKitchenOverviewController();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const metricCards = [
    {
      title: "Total Groceries",
      value: stats.totalGroceries,
      icon: Package,
      color: "text-blue-500",
      bgColor: "bg-blue-50 dark:bg-blue-500/10",
    },
    {
      title: "Expired Items",
      value: stats.expiredItems,
      icon: AlertTriangle,
      color: "text-red-500",
      bgColor: "bg-red-50 dark:bg-red-500/10",
    },
    {
      title: "Low Stock",
      value: stats.lowStockItems,
      icon: AlertTriangle,
      color: "text-yellow-500",
      bgColor: "bg-yellow-50 dark:bg-yellow-500/10",
    },
    {
      title: "Active Lists",
      value: stats.activeLists,
      icon: ShoppingCart,
      color: "text-green-500",
      bgColor: "bg-green-50 dark:bg-green-500/10",
    },
    {
      title: "Upcoming Meals",
      value: stats.upcomingMeals,
      icon: Utensils,
      color: "text-purple-500",
      bgColor: "bg-purple-50 dark:bg-purple-500/10",
    },
    {
      title: "Est. Shopping Cost",
      value: `$${stats.totalEstimatedCost}`,
      icon: DollarSign,
      color: "text-emerald-500",
      bgColor: "bg-emerald-50 dark:bg-emerald-500/10",
    },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {metricCards.map((card, index) => (
        <Card key={index} className="overflow-hidden border-none shadow-sm bg-white dark:bg-white/5">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              {card.title}
            </CardTitle>
            <div className={`p-2 rounded-lg ${card.bgColor}`}>
              <card.icon className={`h-5 w-5 ${card.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black tracking-tighter">
              {card.value}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
