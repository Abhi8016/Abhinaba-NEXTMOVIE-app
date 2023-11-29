import { createSlice } from "@reduxjs/toolkit";
const myList = JSON.parse(localStorage.getItem("watchList"));
const watchListSlice = createSlice({
  name: "watchList",
  initialState: [...myList || ""],
  reducers: {
    add: (state, action) => {
      state?.push(action.payload);
      localStorage?.setItem("watchList", JSON.stringify(state));
    },
    remove: (state, action) => {
      const filterState = state.filter((item) => item.id !== action.payload);
      localStorage?.setItem("watchList", JSON.stringify(filterState));
      return filterState;
    },
  },
});

export const { add, remove } = watchListSlice.actions;
export default watchListSlice.reducer;
