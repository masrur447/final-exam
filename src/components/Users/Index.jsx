import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import User from "./User";

import { getDatabase, onValue, ref } from "firebase/database";

const AllUsers = () => {
  const [search, setSearch] = useState("");
  const user = useSelector((state) => state.user.user);
  const AllUsers = useSelector((state) => state.user.users);
  const [users, setUsers] = useState([]);
  const [oldUsers, setOldUsers] = useState([]);
  const [friendRequest, setFriendRequest] = useState([]);
  const db = getDatabase();
  const dispatch = useDispatch();

  // search users
  useEffect(() => {
    if (search !== "") {
      const filteredUsers = users.filter((user) => {
        return user.name.toLowerCase().includes(search.toLowerCase());
      });
      setUsers(filteredUsers);
    } else {
      setUsers(oldUsers);
    }
  }, [search]);

  useEffect(() => {
    setUsers(AllUsers);
    setOldUsers(AllUsers);
  }, [AllUsers]);

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

  // getFriends
  // useEffect(() => {
  //   if (!user) return;

  //   onValue(ref(db, "friends"), (snapshot) => {
  //     let friends = [];
  //     snapshot.forEach((doc) => {
  //       if (
  //         doc.val().senderId === user.uid ||
  //         doc.val().receiverId === user.uid
  //       ) {
  //         friends.push({ ...doc.val(), id: doc.key });
  //       }
  //     });

  //     dispatch(setFriends(friends));
  //   });
  // }, [db, user?.uid]);

  return (
    <>
      <div className="">
        <h1 className="text-3xl font-semibold">All Users</h1>
        <div className="w-full py-5">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users..."
            className="w-full bg-gray-100 px-2 py-3 rounded-md outline-none"
          />
        </div>
        <div className="flex flex-col items-start gap-y-5 overflow-y-auto no-scrollbar max-h-[80vh]">
          {users.map((user) => (
            <User key={user.id} user={user} friendRequest={friendRequest} />
          ))}
        </div>
      </div>
    </>
  );
};

export default AllUsers;
