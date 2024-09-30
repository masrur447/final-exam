import {
  getDatabase,
  push,
  ref,
  remove,
  serverTimestamp,
  set,
} from "firebase/database";
import { useSelector } from "react-redux";
import { Icons } from "./../../icons/Index";

const User = ({ user, friendRequest }) => {
  const currentUser = useSelector((state) => state.user.user);
  const friends = useSelector((state) => state.friend.friends);
  const db = getDatabase();

  const handleFriendRequest = async () => {
    if (currentUser) {
      // send friend request
      await set(push(ref(db, "friendRequests")), {
        senderId: currentUser.uid,
        receiverId: user.uid,
        createdAt: serverTimestamp(),
      });
    }
  };

  const handleCancelRequest = ({ id }) => {
    remove(ref(db, `friendRequests/${id}`));
  };

  return (
    <div className="flex justify-center items-center gap-x-5">
      <div className="w-[82px] h-[82px] bg-slate-600 rounded-full overflow-hidden">
        <img
          src={user.photoURL || "https://i.pravatar.cc/200/200"}
          className="w-full h-full object-cover"
        />
      </div>
      <p className="text-black text-[23px] truncate font-Inter font-medium leading-7">
        {user.name}
      </p>
      {!friendRequest?.find(
        (f) => f.receiverId === user.uid || f.senderId === user.uid
      ) &&
        !friends?.find(
          (f) => f.receiverId === user.uid || f.senderId === user.uid
        ) && (
          <>
            <button
              className="outline-none hover:text-sky-500 transition"
              onClick={handleFriendRequest}
            >
              <Icons.UserAdd />
            </button>
          </>
        )}
      {friendRequest?.find(
        (f) => f.senderId === currentUser.uid && f.receiverId === user.uid
      ) && (
        <button
          className="outline-none text-sm bg-red-400 p-1 rounded-md text-white"
          onClick={() =>
            handleCancelRequest(
              friendRequest?.find(
                (f) =>
                  f.senderId === currentUser.uid && f.receiverId === user.uid
              )
            )
          }
        >
          Cancel Request
        </button>
      )}
    </div>
  );
};

export default User;
