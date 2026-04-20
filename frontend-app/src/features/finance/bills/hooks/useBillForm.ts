"use client";

import { useCallback, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";
import { setAddBillModalOpen } from "@/lib/store/features/finance/finance-slice";
import { useBills } from "./useBills";
import { useCategories } from "@/features/finance/shared/hooks/useCategories";
import {
  billFormSchema,
  BillFormValues,
  BILL_CREATE_DEFAULTS,
} from "../billFormSchema";
import { mapBillToFormValues } from "../mapBillToFormValues";
import { mapBillFormToPayload } from "../mapBillFormToPayload";
import { Category } from "@/types/finance";

export interface BillFormContext {
  form: ReturnType<typeof useForm<BillFormValues>>;
  isOpen: boolean;
  isEditMode: boolean;
  isPending: boolean;
  availableCategories: Category[];
  onSubmit: (values: BillFormValues) => Promise<void>;
  onClose: (open: boolean) => void;
}

/**
 * Controller hook for Bill Form.
 * 
 * Manages form state, data updates, and submission logic for recurring and one-time bills.
 */
export function useBillForm(): BillFormContext {
  const dispatch = useDispatch();

  const isOpen = useSelector(
    (state: RootState) => state.finance.isAddBillModalOpen,
  );
  const editingBillId = useSelector(
    (state: RootState) => state.finance.editingBillId,
  );

  const { bills, createBill, updateBill } = useBills();
  const { categories } = useCategories();

  const isEditMode = !!editingBillId;

  const editingBill = useMemo(
    () => bills.data?.find((b) => b.id === editingBillId) ?? null,
    [bills.data, editingBillId],
  );

  const form = useForm<BillFormValues>({
    resolver: zodResolver(billFormSchema) as any,
    defaultValues: BILL_CREATE_DEFAULTS as any,
  });

  // Handle pre-filling on modal open or edit switch
  useEffect(() => {
    if (!isOpen) return;

    if (isEditMode && editingBill) {
      form.reset(mapBillToFormValues(editingBill));
    } else if (!isEditMode) {
      form.reset({
        ...BILL_CREATE_DEFAULTS,
        dueDate: new Date().toISOString().split("T")[0],
      });
    }
  }, [isOpen, isEditMode, editingBill, form]);

  const onClose = useCallback(
    (open: boolean) => {
      dispatch(setAddBillModalOpen(open));
    },
    [dispatch],
  );

  const onSubmit = useCallback(
    async (values: BillFormValues) => {
      const payload = mapBillFormToPayload(values);

      try {
        if (isEditMode && editingBillId) {
          await updateBill.mutateAsync({
            id: editingBillId,
            data: payload as any,
          });
        } else {
          await createBill.mutateAsync(payload as any);
        }
        dispatch(setAddBillModalOpen(false));
        form.reset();
      } catch (error: any) {
        console.error("Failed to save bill:", error);
      }
    },
    [isEditMode, editingBillId, createBill, updateBill, dispatch, form],
  );

  const isPending = createBill.isPending || updateBill.isPending;

  return {
    form,
    isOpen,
    isEditMode,
    isPending,
    availableCategories: (categories.data as Category[]) || [],
    onSubmit,
    onClose,
  };
}
