import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  friends: [],
};

const FriendSlice = createSlice({
  name: "friend",
  initialState,
  reducers: {
    setFriends: (state, action) => {
      state.friends = action.payload;
    },
    removeFriend: (state, action) => {
      state.friends = state.friends.filter((f) => f.uid !== action.payload);
    },
  },
});

export const { setFriends, removeFriend } = FriendSlice.actions;
export default FriendSlice.reducer;
