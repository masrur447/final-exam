import { createSlice } from "@reduxjs/toolkit";
import secureLocalStorage from "react-secure-storage";

const initialState = {
  user: secureLocalStorage.getItem("user") || null,
  users: [],
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      secureLocalStorage.setItem("user", action.payload);
    },
    logout: (state) => {
      state.user = null;
      secureLocalStorage.removeItem("user");
    },
    setUsers: (state, action) => {
      state.users = action.payload;
    },
    removeUsers: (state) => {
      state.users = [];
    },
  },
});

export const { setUser, logout, setUsers, removeUsers } = userSlice.actions;
export default userSlice.reducer;
