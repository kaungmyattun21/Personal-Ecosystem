import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { kitchenService } from "@/lib/services/kitchen-service";
import { CreateShoppingListInput, UpdateShoppingListInput, ShoppingList } from "@/types/kitchen";
import { kitchenKeys, kitchenQueries } from "../../shared/kitchenQueries";

export function useShoppingList() {
  const queryClient = useQueryClient();

  const shoppingLists = useQuery(kitchenQueries.shoppingLists());

  const createShoppingList = useMutation({
    mutationFn: (list: CreateShoppingListInput) => kitchenService.createShoppingList(list),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: kitchenKeys.shoppingLists.all() });
    },
  });

  const updateShoppingList = useMutation({
    mutationFn: ({ id, list }: { id: string; list: UpdateShoppingListInput }) =>
      kitchenService.updateShoppingList(id, list),
    onMutate: async ({ id, list }) => {
      await queryClient.cancelQueries({ queryKey: kitchenKeys.shoppingLists.all() });
      const previous = queryClient.getQueryData<ShoppingList[]>(kitchenKeys.shoppingLists.all());
      if (previous) {
        queryClient.setQueryData<ShoppingList[]>(
          kitchenKeys.shoppingLists.all(),
          previous.map((l) => (l.id === id ? ({ ...l, ...list } as ShoppingList) : l)),
        );
      }
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(kitchenKeys.shoppingLists.all(), context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: kitchenKeys.shoppingLists.all() });
    },
  });

  const removeShoppingList = useMutation({
    mutationFn: (id: string) => kitchenService.removeShoppingList(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: kitchenKeys.shoppingLists.all() });
      const previous = queryClient.getQueryData<ShoppingList[]>(kitchenKeys.shoppingLists.all());
      if (previous) {
        queryClient.setQueryData<ShoppingList[]>(
          kitchenKeys.shoppingLists.all(),
          previous.filter((l) => l.id !== id),
        );
      }
      return { previous };
    },
    onError: (_err, _id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(kitchenKeys.shoppingLists.all(), context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: kitchenKeys.shoppingLists.all() });
    },
  });

  return {
    shoppingLists,
    createShoppingList,
    updateShoppingList,
    removeShoppingList,
  };
}
