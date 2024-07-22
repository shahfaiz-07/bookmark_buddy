// tagSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TagState } from "./types";

const initialState: TagState = {
  add: true,
  id: "",
  title: "",
  url: "",
  category: "",
};

export const tagSlice = createSlice({
  name: "tag",
  initialState,
  reducers: {
    setAdd: (state, action: PayloadAction<boolean>) => {
      state.add = action.payload;
    },
    setId: (state, action: PayloadAction<string>) => {
      state.id = action.payload;
    },
    setTitle: (state, action: PayloadAction<string>) => {
      state.title = action.payload;
    },
    setUrl: (state, action: PayloadAction<string>) => {
      state.url = action.payload;
    },
    setCategory: (state, action: PayloadAction<string>) => {
      state.category = action.payload;
    },
    resetTagData: (state) => {
      state.add = true;
      state.id = "";
      state.category = "";
      state.url = "";
      state.title = "";
    }
  }
});

export const { setAdd, setId, setTitle, setUrl, setCategory, resetTagData } = tagSlice.actions;
export default tagSlice.reducer;
