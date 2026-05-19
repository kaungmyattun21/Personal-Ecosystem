import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import * as RHF from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";
import { setMealPlanEditorOpen } from "@/lib/store/features/kitchen/kitchen-slice";
import { useMealPlan } from "./useMealPlan";
import { useEffect } from "react";
import { toast } from "sonner";
import { mapMealPlanFormToPayload } from "../utils/mapMealPlanFormToPayload";
import { mapMealPlanToFormValues } from "../utils/mapMealPlanToFormValues";
import {
  mealPlanFormSchema,
  MealPlanFormValues,
  MEAL_PLAN_FORM_DEFAULTS,
  MEAL_FORM_DEFAULTS,
} from "../mealPlanSchema";
import { useGroceries } from "../../groceries/hooks/useGroceries";

const useForm = (RHF as any).useForm;
const useFieldArray = (RHF as any).useFieldArray;

export function useMealPlanForm() {
  const dispatch = useDispatch();
  const { isMealPlanEditorOpen, editingMealPlanId } = useSelector(
    (state: RootState) => state.kitchen,
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
      // Initialize with a week of empty meals for better UX
      const startDate = new Date();
      const meals = [];

      for (let i = 0; i < 7; i++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);
        const dateStr = date.toISOString().split("T")[0];

        meals.push({
          ...MEAL_FORM_DEFAULTS,
          date: dateStr,
          type: "BREAKFAST",
          name: "",
        });
        meals.push({
          ...MEAL_FORM_DEFAULTS,
          date: dateStr,
          type: "LUNCH",
          name: "",
        });
        meals.push({
          ...MEAL_FORM_DEFAULTS,
          date: dateStr,
          type: "DINNER",
          name: "",
        });
      }

      form.reset({
        ...MEAL_PLAN_FORM_DEFAULTS,
        startDate: startDate.toISOString().split("T")[0],
        endDate: new Date(startDate.getTime() + 6 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
        meals,
      });
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
    dispatch(setMealPlanEditorOpen(false));
    form.reset();
  };

  const addMeal = (date?: string) => {
    const targetDate = date || form.getValues("startDate");
    append({
      ...MEAL_FORM_DEFAULTS,
      date: targetDate,
    });
  };

  const removeDay = (date: string) => {
    const meals = form.getValues("meals") || [];
    const indicesToRemove = meals
      .map((m: any, i: number) => (m.date === date ? i : -1))
      .filter((i: number) => i !== -1)
      .sort((a: number, b: number) => b - a); // Remove from end to start to maintain indices

    indicesToRemove.forEach((i: number) => remove(i));
    toast.success(`All meals for ${format(new Date(date), "EEEE")} removed`);
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

  const getGroupedMeals = () => {
    const groups: { [date: string]: number[] } = {};
    fields.forEach((field: any, index: number) => {
      const date = form.watch(`meals.${index}.date`) || "No Date";
      if (!groups[date]) groups[date] = [];
      groups[date].push(index);
    });

    return Object.keys(groups)
      .sort()
      .map((date) => ({
        date,
        indices: groups[date],
      }));
  };

  return {
    form,
    fields,
    groupedMeals: getGroupedMeals(),
    addMeal,
    duplicateMeal,
    removeDay,
    removeMeal: remove,
    onSubmit: form.handleSubmit(onSubmit),
    isOpen: isMealPlanEditorOpen,
    onClose,
    isEditMode: !!editingMealPlanId,
    isLoading: createMealPlan.isPending || updateMealPlan.isPending,
    groceries: groceryItems.data || [],
  };
}
