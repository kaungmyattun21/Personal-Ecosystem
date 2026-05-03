import { zodResolver } from "@hookform/resolvers/zod";
import * as RHF from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";
import { setAddMealPlanModalOpen } from "@/lib/store/features/kitchen/kitchen-slice";
import { useMealPlan } from "./useMealPlan";
import { useEffect } from "react";
import { toast } from "sonner";
import { mapMealPlanFormToPayload } from "../utils/mapMealPlanFormToPayload";
import { mapMealPlanToFormValues } from "../utils/mapMealPlanToFormValues";
import { mealPlanFormSchema, MealPlanFormValues, MEAL_PLAN_FORM_DEFAULTS, MEAL_FORM_DEFAULTS } from "../mealPlanSchema";
import { useGroceries } from "../../groceries/hooks/useGroceries";

const useForm = (RHF as any).useForm;
const useFieldArray = (RHF as any).useFieldArray;

export function useMealPlanForm() {
  const dispatch = useDispatch();
  const { isAddMealPlanModalOpen, editingMealPlanId } = useSelector(
    (state: RootState) => state.kitchen
  );
  const { mealPlans, createMealPlan, updateMealPlan } = useMealPlan();
  const { groceryItems } = useGroceries();

  const editingPlan = editingMealPlanId
    ? mealPlans.data?.find((p) => p.id === editingMealPlanId)
    : null;

  const form = useForm({
    resolver: zodResolver(mealPlanFormSchema),
    defaultValues: MEAL_PLAN_FORM_DEFAULTS,
  });

  const { fields, append, remove, insert } = useFieldArray({
    control: form.control,
    name: "meals",
  });

  useEffect(() => {
    if (editingPlan) {
      form.reset(mapMealPlanToFormValues(editingPlan));
    } else {
      form.reset(MEAL_PLAN_FORM_DEFAULTS);
    }
  }, [editingPlan, form]);

  const onSubmit = async (values: MealPlanFormValues) => {
    try {
      const payload = mapMealPlanFormToPayload(values);

      if (editingMealPlanId) {
        await updateMealPlan.mutateAsync({
          id: editingMealPlanId,
          plan: payload as any,
        });
        toast.success("Meal plan updated");
      } else {
        await createMealPlan.mutateAsync(payload as any);
        toast.success("Meal plan created");
      }
      onClose();
    } catch (error) {
      console.error("Meal plan submission error:", error);
      toast.error("Something went wrong");
    }
  };

  const onClose = () => {
    dispatch(setAddMealPlanModalOpen(false));
    form.reset();
  };

  const addMeal = () => {
    const currentMeals = form.getValues("meals") || [];
    let nextDate = form.getValues("startDate");

    if (currentMeals.length > 0) {
      const lastDate = new Date(currentMeals[currentMeals.length - 1].date);
      lastDate.setDate(lastDate.getDate() + 1);
      nextDate = lastDate.toISOString().split("T")[0];
    }

    append({
      ...MEAL_FORM_DEFAULTS,
      date: nextDate,
    });
  };

  const duplicateMeal = (index: number) => {
    const mealToCopy = form.getValues(`meals.${index}`);
    const nextDate = new Date(mealToCopy.date);
    nextDate.setDate(nextDate.getDate() + 1);

    insert(index + 1, {
      ...JSON.parse(JSON.stringify(mealToCopy)),
      date: nextDate.toISOString().split("T")[0],
    });
    toast.success("Meal duplicated to next day");
  };

  return {
    form,
    fields,
    addMeal,
    duplicateMeal,
    removeMeal: remove,
    onSubmit: form.handleSubmit(onSubmit),
    isOpen: isAddMealPlanModalOpen,
    onClose,
    isEditMode: !!editingMealPlanId,
    isLoading: createMealPlan.isPending || updateMealPlan.isPending,
    groceries: groceryItems.data || [],
  };
}
