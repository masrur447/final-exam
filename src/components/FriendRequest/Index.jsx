import { getDatabase, onValue, ref } from "firebase/database";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import User from "./User";

const FriendRequest = () => {
  const user = useSelector((state) => state.user.user);
  const [friendRequest, setFriendRequest] = useState([]);
  const users = useSelector((state) => state.user.users);
  const db = getDatabase();

  // get friend request
  useEffect(() => {
    if (!user) return;
    onValue(ref(db, "friendRequests"), (snapshot) => {
      let friendRequest = [];
      snapshot.forEach((doc) => {
        if (
          doc.val().senderId === user.uid ||
          doc.val().receiverId === user.uid
        ) {
          friendRequest.push({ ...doc.val(), id: doc.key });
        }
      });
      setFriendRequest(friendRequest);
    });
  }, [db, user?.uid]);

  return (
    <>
      <div className="">
        <h1 className="text-3xl font-semibold pb-5">Friend Request</h1>
        <div className="flex flex-col items-start gap-y-5 overflow-y-auto no-scrollbar max-h-[83vh]">
          {friendRequest?.map((user) => (
            <User key={user.id} user={user} users={users} />
          ))}
        </div>
      </div>
    </>
  );
};

export default FriendRequest;
