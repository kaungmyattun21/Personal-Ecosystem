import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface KitchenUIState {
  activeTab: "overview" | "groceries" | "shopping-list" | "meal-plan";
  isAddGroceryModalOpen: boolean;
  isBulkAddGroceryModalOpen: boolean;
  isAddShoppingListModalOpen: boolean;
  isMealPlanEditorOpen: boolean;
  editingGroceryItemId: string | null;
  editingShoppingListId: string | null;
  editingMealPlanId: string | null;
  viewingMealPlanId: string | null;
}

const initialState: KitchenUIState = {
  activeTab: "overview",
  isAddGroceryModalOpen: false,
  isBulkAddGroceryModalOpen: false,
  isAddShoppingListModalOpen: false,
  isMealPlanEditorOpen: false,
  editingGroceryItemId: null,
  editingShoppingListId: null,
  editingMealPlanId: null,
  viewingMealPlanId: null,
};

export const kitchenSlice = createSlice({
  name: "kitchen",
  initialState,
  reducers: {
    setActiveTab: (state, action: PayloadAction<KitchenUIState["activeTab"]>) => {
      state.activeTab = action.payload;
    },
    setAddGroceryModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isAddGroceryModalOpen = action.payload;
      if (!action.payload) state.editingGroceryItemId = null;
    },
    setBulkAddGroceryModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isBulkAddGroceryModalOpen = action.payload;
    },
    openEditGrocery: (state, action: PayloadAction<string>) => {
      state.editingGroceryItemId = action.payload;
      state.isAddGroceryModalOpen = true;
    },
    setAddShoppingListModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isAddShoppingListModalOpen = action.payload;
      if (!action.payload) state.editingShoppingListId = null;
    },
    openEditShoppingList: (state, action: PayloadAction<string>) => {
      state.editingShoppingListId = action.payload;
      state.isAddShoppingListModalOpen = true;
    },
    setMealPlanEditorOpen: (state, action: PayloadAction<boolean>) => {
      state.isMealPlanEditorOpen = action.payload;
      if (!action.payload) state.editingMealPlanId = null;
    },
    openEditMealPlan: (state, action: PayloadAction<string>) => {
      state.editingMealPlanId = action.payload;
      state.isMealPlanEditorOpen = true;
    },
    setViewingMealPlanId: (state, action: PayloadAction<string | null>) => {
      state.viewingMealPlanId = action.payload;
    },
  },
});

export const {
  setActiveTab,
  setAddGroceryModalOpen,
  setBulkAddGroceryModalOpen,
  openEditGrocery,
  setAddShoppingListModalOpen,
  openEditShoppingList,
  setMealPlanEditorOpen,
  openEditMealPlan,
  setViewingMealPlanId,
} = kitchenSlice.actions;

export default kitchenSlice.reducer;
