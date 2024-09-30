import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
};

const SingleUserSlice = createSlice({
  name: "singleUser",
  initialState,
  reducers: {
    setSingleUser: (state, action) => {
      state.user = action.payload;
    },
  },
});

export const { setSingleUser } = SingleUserSlice.actions;
export default SingleUserSlice.reducer;
