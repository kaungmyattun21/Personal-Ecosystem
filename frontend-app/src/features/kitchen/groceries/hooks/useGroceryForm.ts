import { zodResolver } from "@hookform/resolvers/zod";
import * as RHF from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";
import { setAddGroceryModalOpen } from "@/lib/store/features/kitchen/kitchen-slice";
import { useGroceries } from "./useGroceries";
import { useEffect } from "react";
import { toast } from "sonner";
import { mapGroceryFormToPayload } from "../utils/mapGroceryFormToPayload";
import { mapGroceryToFormValues } from "../utils/mapGroceryToFormValues";
import { groceryFormSchema, GroceryFormValues, GROCERY_FORM_DEFAULTS } from "../grocerySchema";

// Bypassing TypeScript resolution issues for useForm
const useForm = (RHF as any).useForm;

export function useGroceryForm() {
  const dispatch = useDispatch();
  const { isAddGroceryModalOpen, editingGroceryItemId } = useSelector(
    (state: RootState) => state.kitchen
  );
  const { groceryItems, addGroceryItem, updateGroceryItem } = useGroceries();

  const editingItem = editingGroceryItemId
    ? groceryItems.data?.find((i) => i.id === editingGroceryItemId)
    : null;

  const form = useForm({
    resolver: zodResolver(groceryFormSchema),
    defaultValues: GROCERY_FORM_DEFAULTS,
  });

  useEffect(() => {
    if (editingItem) {
      form.reset(mapGroceryToFormValues(editingItem));
    } else {
      form.reset(GROCERY_FORM_DEFAULTS);
    }
  }, [editingItem, form]);

  const onSubmit = async (values: GroceryFormValues) => {
    try {
      const payload = mapGroceryFormToPayload(values);

      if (editingGroceryItemId) {
        await updateGroceryItem.mutateAsync({
          id: editingGroceryItemId,
          item: payload as any,
        });
        toast.success("Grocery item updated");
      } else {
        await addGroceryItem.mutateAsync(payload as any);
        toast.success("Grocery item added");
      }
      onClose();
    } catch (error) {
      console.error("Grocery submission error:", error);
      toast.error("Something went wrong");
    }
  };

  const onClose = () => {
    dispatch(setAddGroceryModalOpen(false));
    form.reset();
  };

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
    isOpen: isAddGroceryModalOpen,
    onClose,
    isEditMode: !!editingGroceryItemId,
    isLoading: addGroceryItem.isPending || updateGroceryItem.isPending,
  };
}
