import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface FinanceUIState {
  isAddTransactionModalOpen: boolean;
  isAddBudgetModalOpen: boolean;
  isAddBillModalOpen: boolean;
  /** ID of the transaction currently being edited, or null for create mode */
  editingTransactionId: string | null;
  /** ID of the budget currently being edited, or null for create mode */
  editingBudgetId: string | null;
  /** ID of the bill currently being edited, or null for create mode */
  editingBillId: string | null;
  /** ID of the saving goal currently being edited, or null for create mode */
  editingSavingGoalId: string | null;
  isAddSavingGoalModalOpen: boolean;
  activeTab: "overview" | "transactions" | "budgets" | "bills" | "goals";
  filters: {
    dateRange: [string | null, string | null];
    categoryId: string | null;
    type: string | null;
  };
}

const initialState: FinanceUIState = {
  isAddTransactionModalOpen: false,
  isAddBudgetModalOpen: false,
  isAddBillModalOpen: false,
  isAddSavingGoalModalOpen: false,
  editingTransactionId: null,
  editingBudgetId: null,
  editingBillId: null,
  editingSavingGoalId: null,
  activeTab: "overview",
  filters: {
    dateRange: [null, null],
    categoryId: null,
    type: null,
  },
};

export const financeSlice = createSlice({
  name: "finance",
  initialState,
  reducers: {
    setAddTransactionModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isAddTransactionModalOpen = action.payload;
      if (!action.payload) state.editingTransactionId = null; // clear on close
    },
    setAddBudgetModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isAddBudgetModalOpen = action.payload;
      if (!action.payload) state.editingBudgetId = null;
    },
    openEditBudget: (state, action: PayloadAction<string>) => {
      state.editingBudgetId = action.payload;
      state.isAddBudgetModalOpen = true;
    },
    setAddBillModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isAddBillModalOpen = action.payload;
      if (!action.payload) state.editingBillId = null;
    },
    /** Open the modal in edit mode for the given bill id */
    openEditBill: (state, action: PayloadAction<string>) => {
      state.editingBillId = action.payload;
      state.isAddBillModalOpen = true;
    },
    /** Open the modal in edit mode for the given transaction id */
    openEditTransaction: (state, action: PayloadAction<string>) => {
      state.editingTransactionId = action.payload;
      state.isAddTransactionModalOpen = true;
    },
    setAddSavingGoalModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isAddSavingGoalModalOpen = action.payload;
      if (!action.payload) state.editingSavingGoalId = null;
    },
    openEditSavingGoal: (state, action: PayloadAction<string>) => {
      state.editingSavingGoalId = action.payload;
      state.isAddSavingGoalModalOpen = true;
    },
    setActiveTab: (
      state,
      action: PayloadAction<FinanceUIState["activeTab"]>,
    ) => {
      state.activeTab = action.payload;
    },
    setFilters: (
      state,
      action: PayloadAction<Partial<FinanceUIState["filters"]>>,
    ) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
    },
  },
});

export const {
  setAddTransactionModalOpen,
  setAddBudgetModalOpen,
  setAddBillModalOpen,
  openEditBill,
  openEditTransaction,
  openEditBudget,
  openEditSavingGoal,
  setAddSavingGoalModalOpen,
  setActiveTab,
  setFilters,
  resetFilters,
} = financeSlice.actions;

export default financeSlice.reducer;
