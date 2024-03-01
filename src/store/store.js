import { configureStore } from "@reduxjs/toolkit";
import homeSlice from "./homeSlice";
import watchListSlice from "./watchListSlice";

export const store = configureStore({
  reducer: {
    home: homeSlice,
    watchList: watchListSlice,
  },
});
