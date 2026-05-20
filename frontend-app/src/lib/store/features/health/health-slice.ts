import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface HealthUIState {
  activeTab: "overview" | "workouts" | "metrics";
}

const initialState: HealthUIState = {
  activeTab: "overview",
};

export const healthSlice = createSlice({
  name: "health",
  initialState,
  reducers: {
    setActiveTab: (state, action: PayloadAction<HealthUIState["activeTab"]>) => {
      state.activeTab = action.payload;
    },
  },
});

export const { setActiveTab } = healthSlice.actions;
export default healthSlice.reducer;
