"use client";

import { useShoppingListController } from "../hooks/useShoppingListController";
import { ShoppingListCard } from "../components/ShoppingListCard";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";

export function ShoppingListView() {
  const {
    lists,
    isLoading,
    handleDelete,
    handleEdit,
    handleCreate,
    handleView,
  } = useShoppingListController();

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
        <h2 className="text-xl font-semibold">My Shopping Lists</h2>
        <Button onClick={handleCreate} className="h-12 px-6 rounded-xl flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Create List
        </Button>
      </div>

      {lists.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lists.map((list) => (
            <ShoppingListCard
              key={list.id}
              list={list}
              onEdit={handleEdit}
              onDelete={() => handleDelete(list.id)}
              onView={handleView}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 border-2 border-dashed rounded-3xl bg-slate-50/50 dark:bg-white/5 border-slate-200 dark:border-white/10">
          <p className="text-muted-foreground text-lg">No shopping lists found.</p>
          <Button variant="link" className="mt-2 text-brand-teal" onClick={handleCreate}>
            Create your first list
          </Button>
        </div>
      )}
    </div>
  );
}
