"use client";

import { useGroceriesController } from "../hooks/useGroceriesController";
import { GroceryCard } from "../components/GroceryCard";
import { Button } from "@/components/ui/button";
import { Plus, Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";

export function GroceriesView() {
  const {
    items,
    isLoading,
    searchQuery,
    setSearchQuery,
    handleDelete,
    handleEdit,
    handleAdd,
  } = useGroceriesController();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search groceries..."
            className="pl-10 h-12 rounded-xl"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button onClick={handleAdd} className="h-12 px-6 rounded-xl flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Item
        </Button>
      </div>

      {items.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <GroceryCard
              key={item.id}
              item={item}
              onEdit={handleEdit}
              onDelete={() => handleDelete(item.id)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 border-2 border-dashed rounded-3xl bg-slate-50/50 dark:bg-white/5 border-slate-200 dark:border-white/10">
          <p className="text-muted-foreground text-lg">No grocery items found.</p>
          <Button variant="link" className="mt-2 text-brand-teal" onClick={() => setSearchQuery("")}>
            Clear search
          </Button>
        </div>
      )}
    </div>
  );
}
