import { configureStore } from "@reduxjs/toolkit";
import financeReducer from "./features/finance/finance-slice";

export const store = configureStore({
  reducer: {
    finance: financeReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
