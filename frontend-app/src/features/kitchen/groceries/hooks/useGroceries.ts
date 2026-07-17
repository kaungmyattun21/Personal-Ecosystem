import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { kitchenService } from "@/lib/services/kitchen-service";
import { CreateGroceryItemInput, UpdateGroceryItemInput, GroceryItem } from "@/types/kitchen";
import { kitchenKeys, kitchenQueries } from "../../shared/kitchenQueries";
import { useAuthReady } from "@/lib/hooks/useAuthReady";

export function useGroceries() {
  const queryClient = useQueryClient();
  const authReady = useAuthReady();

  const groceryItems = useQuery({ ...kitchenQueries.groceryItems(), enabled: authReady });

  const addGroceryItem = useMutation({
    mutationFn: (item: CreateGroceryItemInput) => kitchenService.addGroceryItem(item),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: kitchenKeys.groceryItems() });
    },
  });

  const addMultipleGroceryItems = useMutation({
    mutationFn: (items: CreateGroceryItemInput[]) => kitchenService.addMultipleGroceryItems(items),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: kitchenKeys.groceryItems() });
    },
  });

  const updateGroceryItem = useMutation({
    mutationFn: ({ id, item }: { id: string; item: UpdateGroceryItemInput }) =>
      kitchenService.updateGroceryItem(id, item),
    onMutate: async ({ id, item }) => {
      await queryClient.cancelQueries({ queryKey: kitchenKeys.groceryItems() });
      const previous = queryClient.getQueryData<GroceryItem[]>(kitchenKeys.groceryItems());
      if (previous) {
        queryClient.setQueryData<GroceryItem[]>(
          kitchenKeys.groceryItems(),
          previous.map((g) => (g.id === id ? ({ ...g, ...item } as GroceryItem) : g)),
        );
      }
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(kitchenKeys.groceryItems(), context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: kitchenKeys.groceryItems() });
    },
  });

  const removeGroceryItem = useMutation({
    mutationFn: (id: string) => kitchenService.removeGroceryItem(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: kitchenKeys.groceryItems() });
      const previous = queryClient.getQueryData<GroceryItem[]>(kitchenKeys.groceryItems());
      if (previous) {
        queryClient.setQueryData<GroceryItem[]>(
          kitchenKeys.groceryItems(),
          previous.filter((g) => g.id !== id),
        );
      }
      return { previous };
    },
    onError: (_err, _id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(kitchenKeys.groceryItems(), context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: kitchenKeys.groceryItems() });
    },
  });

  return {
    groceryItems,
    addGroceryItem,
    addMultipleGroceryItems,
    updateGroceryItem,
    removeGroceryItem,
  };
}
