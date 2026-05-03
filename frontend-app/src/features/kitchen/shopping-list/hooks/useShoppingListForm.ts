import { zodResolver } from "@hookform/resolvers/zod";
import * as RHF from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";
import { setAddShoppingListModalOpen } from "@/lib/store/features/kitchen/kitchen-slice";
import { useShoppingList } from "./useShoppingList";
import { useEffect } from "react";
import { toast } from "sonner";
import { mapShoppingListFormToPayload } from "../utils/mapShoppingListFormToPayload";
import { mapShoppingListToFormValues } from "../utils/mapShoppingListToFormValues";
import { shoppingListFormSchema, ShoppingListFormValues, SHOPPING_LIST_FORM_DEFAULTS } from "../shoppingListSchema";

const useForm = (RHF as any).useForm;

export function useShoppingListForm() {
  const dispatch = useDispatch();
  const { isAddShoppingListModalOpen, editingShoppingListId } = useSelector(
    (state: RootState) => state.kitchen
  );
  const { shoppingLists, createShoppingList, updateShoppingList } = useShoppingList();

  const editingList = editingShoppingListId
    ? shoppingLists.data?.find((l) => l.id === editingShoppingListId)
    : null;

  const form = useForm({
    resolver: zodResolver(shoppingListFormSchema),
    defaultValues: SHOPPING_LIST_FORM_DEFAULTS,
  });

  useEffect(() => {
    if (editingList) {
      form.reset(mapShoppingListToFormValues(editingList));
    } else {
      form.reset(SHOPPING_LIST_FORM_DEFAULTS);
    }
  }, [editingList, form]);

  const onSubmit = async (values: ShoppingListFormValues) => {
    try {
      const payload = mapShoppingListFormToPayload(values);

      if (editingShoppingListId) {
        await updateShoppingList.mutateAsync({
          id: editingShoppingListId,
          list: payload as any,
        });
        toast.success("Shopping list updated");
      } else {
        await createShoppingList.mutateAsync(payload as any);
        toast.success("Shopping list created");
      }
      onClose();
    } catch (error) {
      console.error("Shopping list submission error:", error);
      toast.error("Something went wrong");
    }
  };

  const onClose = () => {
    dispatch(setAddShoppingListModalOpen(false));
    form.reset();
  };

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
    isOpen: isAddShoppingListModalOpen,
    onClose,
    isEditMode: !!editingShoppingListId,
    isLoading: createShoppingList.isPending || updateShoppingList.isPending,
  };
}
