import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface KitchenUIState {
  activeTab: "overview" | "groceries" | "shopping-list" | "meal-plan";
  isAddGroceryModalOpen: boolean;
  isBulkAddGroceryModalOpen: boolean;
  isAddShoppingListModalOpen: boolean;
  isAddMealPlanModalOpen: boolean;
  editingGroceryItemId: string | null;
  editingShoppingListId: string | null;
  editingMealPlanId: string | null;
}

const initialState: KitchenUIState = {
  activeTab: "overview",
  isAddGroceryModalOpen: false,
  isBulkAddGroceryModalOpen: false,
  isAddShoppingListModalOpen: false,
  isAddMealPlanModalOpen: false,
  editingGroceryItemId: null,
  editingShoppingListId: null,
  editingMealPlanId: null,
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
    setAddMealPlanModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isAddMealPlanModalOpen = action.payload;
      if (!action.payload) state.editingMealPlanId = null;
    },
    openEditMealPlan: (state, action: PayloadAction<string>) => {
      state.editingMealPlanId = action.payload;
      state.isAddMealPlanModalOpen = true;
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
  setAddMealPlanModalOpen,
  openEditMealPlan,
} = kitchenSlice.actions;

export default kitchenSlice.reducer;
