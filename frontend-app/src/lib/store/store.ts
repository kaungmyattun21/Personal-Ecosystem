import { configureStore } from "@reduxjs/toolkit";
import financeReducer from "./features/finance/finance-slice";
import kitchenReducer from "./features/kitchen/kitchen-slice";
import healthReducer from "./features/health/health-slice";

export const store = configureStore({
  reducer: {
    finance: financeReducer,
    kitchen: kitchenReducer,
    health: healthReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
