import { configureStore } from "@reduxjs/toolkit";
import { destinationSlice } from "../features/destinationSlice";

export const store = configureStore({
  reducer: {
    destinations: destinationSlice.reducer,
  },
});
