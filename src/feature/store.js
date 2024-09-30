import { configureStore } from "@reduxjs/toolkit";
import FriendSlice from "./FriendSlice";
import SingleUserSlice from "./SingleUserSlice";
import UserSlice from "./UserSlice";

const store = configureStore({
  reducer: {
    user: UserSlice,
    friend: FriendSlice,
    singleUser: SingleUserSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
