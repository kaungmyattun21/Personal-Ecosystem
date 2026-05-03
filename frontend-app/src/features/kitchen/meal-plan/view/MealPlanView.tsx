"use client";

import { useMealPlanController } from "../hooks/useMealPlanController";
import { MealPlanCard } from "../components/MealPlanCard";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";

export function MealPlanView() {
  const {
    plans,
    isLoading,
    handleDelete,
    handleEdit,
    handleCreate,
    handleView,
  } = useMealPlanController();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">My Meal Plans</h2>
        <Button onClick={handleCreate} className="h-12 px-6 rounded-xl flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Create Plan
        </Button>
      </div>

      {plans.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <MealPlanCard
              key={plan.id}
              plan={plan}
              onEdit={handleEdit}
              onDelete={() => handleDelete(plan.id)}
              onView={handleView}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 border-2 border-dashed rounded-3xl bg-slate-50/50 dark:bg-white/5 border-slate-200 dark:border-white/10">
          <p className="text-muted-foreground text-lg">No meal plans found.</p>
          <Button variant="link" className="mt-2 text-brand-teal" onClick={handleCreate}>
            Schedule your first week
          </Button>
        </div>
      )}
    </div>
  );
}
