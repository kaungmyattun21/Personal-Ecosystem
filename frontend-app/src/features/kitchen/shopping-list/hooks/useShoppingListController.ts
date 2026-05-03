import { useShoppingList } from "./useShoppingList";
import { ShoppingList } from "@/types/kitchen";
import { toast } from "sonner";
import { useConfirm } from "@/providers/confirm-provider";
import { useDispatch } from "react-redux";
import { openEditShoppingList, setAddShoppingListModalOpen } from "@/lib/store/features/kitchen/kitchen-slice";

export function useShoppingListController() {
  const { shoppingLists, removeShoppingList } = useShoppingList();
  const { confirm } = useConfirm();
  const dispatch = useDispatch();

  const handleDelete = async (id: string) => {
    const list = shoppingLists.data?.find(l => l.id === id);
    const isConfirmed = await confirm({
      title: "Delete Shopping List",
      description: `Are you sure you want to delete "${list?.name || "this list"}"? This cannot be undone.`,
      confirmText: "Delete",
      variant: "destructive",
    });

    if (isConfirmed) {
      try {
        await removeShoppingList.mutateAsync(id);
        toast.success("Shopping list deleted");
      } catch (error) {
        toast.error("Failed to delete list");
      }
    }
  };

  const handleEdit = (list: ShoppingList) => {
    dispatch(openEditShoppingList(list.id));
  };

  const handleCreate = () => {
    dispatch(setAddShoppingListModalOpen(true));
  };

  const handleView = (id: string) => {
    // Navigate to detail view or open detail modal
    console.log("View shopping list:", id);
  };

  return {
    lists: shoppingLists.data ?? [],
    isLoading: shoppingLists.isLoading,
    handleDelete,
    handleEdit,
    handleCreate,
    handleView,
  };
}
