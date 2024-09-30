import { getDatabase, onValue, ref } from "firebase/database";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import { setFriends } from "../feature/FriendSlice";
import Sidebar from "./../components/Sidebar/Index";
import { setUsers as setAllUsers } from "./../feature/UserSlice";

const RootLayout = () => {
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  const db = getDatabase();

  // get all users
  useEffect(() => {
    const getUser = async () => {
      onValue(ref(db, "users"), (snapshot) => {
        let users = [];
        snapshot.forEach((doc) => {
          if (doc.val().uid !== user?.uid) {
            users.push({ ...doc.val(), id: doc.key });
          }
        });
        dispatch(setAllUsers(users));
      });
    };
    getUser();
  }, [db, user?.uid]);
  // getFriends
  useEffect(() => {
    if (!user) return;

    onValue(ref(db, "friends"), (snapshot) => {
      let friends = [];
      snapshot.forEach((doc) => {
        if (
          doc.val().senderId === user.uid ||
          doc.val().receiverId === user.uid
        ) {
          friends.push({ ...doc.val(), id: doc.key });
        }
      });

      dispatch(setFriends(friends));
    });
  }, [db, user?.uid]);
  return (
    <div className="grid grid-cols-[150px_1fr] w-full min-h-screen">
      <Sidebar />
      <Outlet />
    </div>
  );
};

export default RootLayout;
