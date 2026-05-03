import * as RHF from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";
import { setBulkAddGroceryModalOpen } from "@/lib/store/features/kitchen/kitchen-slice";
import { useGroceries } from "./useGroceries";
import { toast } from "sonner";
import { mapGroceryFormToPayload } from "../utils/mapGroceryFormToPayload";
import { GROCERY_FORM_DEFAULTS, groceryFormSchema } from "../grocerySchema";

// Schema for the entire bulk form
const bulkGrocerySchema = z.object({
  items: z.array(groceryFormSchema).min(1, "At least one item is required"),
});

type BulkGroceryValues = z.infer<typeof bulkGrocerySchema>;

// Bypassing TS resolution for useForm and useFieldArray
const useForm = (RHF as any).useForm;
const useFieldArray = (RHF as any).useFieldArray;

export function useBulkGroceryForm() {
  const dispatch = useDispatch();
  const { isBulkAddGroceryModalOpen } = useSelector(
    (state: RootState) => state.kitchen
  );
  const { addMultipleGroceryItems } = useGroceries();

  const form = useForm({
    resolver: zodResolver(bulkGrocerySchema),
    defaultValues: {
      items: [GROCERY_FORM_DEFAULTS],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  const onSubmit = async (values: BulkGroceryValues) => {
    try {
      const payload = values.items.map(mapGroceryFormToPayload);
      await addMultipleGroceryItems.mutateAsync(payload);
      toast.success(`${payload.length} items added successfully`);
      onClose();
    } catch (error) {
      console.error("Bulk grocery submission error:", error);
      toast.error("Failed to add multiple items");
    }
  };

  const onClose = () => {
    dispatch(setBulkAddGroceryModalOpen(false));
    form.reset({
      items: [GROCERY_FORM_DEFAULTS],
    });
  };

  const addRow = () => append(GROCERY_FORM_DEFAULTS);

  return {
    form,
    fields,
    addRow,
    removeRow: remove,
    onSubmit: form.handleSubmit(onSubmit),
    isOpen: isBulkAddGroceryModalOpen,
    onClose,
    isLoading: addMultipleGroceryItems.isPending,
  };
}
