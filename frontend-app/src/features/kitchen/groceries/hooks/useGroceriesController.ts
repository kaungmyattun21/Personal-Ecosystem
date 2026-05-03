import { useState, useMemo } from "react";
import { useGroceries } from "./useGroceries";
import { GroceryItem } from "@/types/kitchen";
import { toast } from "sonner";
import { useConfirm } from "@/providers/confirm-provider";
import { useDispatch } from "react-redux";
import { openEditGrocery, setAddGroceryModalOpen } from "@/lib/store/features/kitchen/kitchen-slice";

export function useGroceriesController() {
  const { groceryItems, removeGroceryItem } = useGroceries();
  const [searchQuery, setSearchQuery] = useState("");
  const { confirm } = useConfirm();
  const dispatch = useDispatch();

  const filteredItems = useMemo(() => {
    return groceryItems.data?.filter((item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.category && item.category.toLowerCase().includes(searchQuery.toLowerCase()))
    ) ?? [];
  }, [groceryItems.data, searchQuery]);

  const handleDelete = async (id: string) => {
    const item = groceryItems.data?.find(i => i.id === id);
    const isConfirmed = await confirm({
      title: "Confirm Deletion",
      description: `Are you sure you want to delete "${item?.name || "this item"}"?`,
      confirmText: "Delete",
      variant: "destructive",
    });

    if (isConfirmed) {
      try {
        await removeGroceryItem.mutateAsync(id);
        toast.success("Item deleted successfully");
      } catch (error) {
        toast.error("Failed to delete item");
      }
    }
  };

  const handleEdit = (item: GroceryItem) => {
    dispatch(openEditGrocery(item.id));
  };

  const handleAdd = () => {
    dispatch(setAddGroceryModalOpen(true));
  };

  return {
    items: filteredItems,
    isLoading: groceryItems.isLoading,
    searchQuery,
    setSearchQuery,
    handleDelete,
    handleEdit,
    handleAdd,
  };
}
