import {
  getDatabase,
  push,
  ref,
  remove,
  serverTimestamp,
  set,
} from "firebase/database";
import { useSelector } from "react-redux";

const User = ({ user, users }) => {
  const { uid } = useSelector((state) => state.user.user);
  if (uid === user.senderId) return null;
  const db = getDatabase();

  const handleAccecpt = (uid) => {
    remove(ref(db, `friendRequests/${uid}`));
    const { receiverId, senderId } = user;
    set(push(ref(db, "friends")), {
      receiverId: receiverId,
      senderId: senderId,
      blocked: false,
      createdAt: serverTimestamp(),
    });
  };
  const handleReject = (uid) => {
    remove(ref(db, `friendRequests/${uid}`));
  };
  return (
    <div className="flex justify-center items-center gap-x-5">
      <div className="w-[82px] h-[82px] bg-slate-600 rounded-full overflow-hidden">
        <img
          src={
            users.find((f) => f.uid === user.senderId)?.photoURL ||
            "https://i.pravatar.cc/200/200"
          }
          className="w-full h-full object-cover"
        />
      </div>
      <p className="text-black text-[23px] truncate font-Inter font-medium leading-7">
        {users.find((f) => f.uid === user.senderId)?.name}
      </p>
      <div className="flex justify-center items-center gap-x-2">
        <button
          className="bg-sky-400 text-white text-sm rounded-md px-4 py-2 transition hover:bg-sky-500"
          onClick={() => handleAccecpt(user.id)}
        >
          Accept
        </button>
        <button
          className="bg-red-400 text-white text-sm rounded-md px-4 py-2 transition hover:bg-red-500"
          onClick={() => handleReject(user.id)}
        >
          Reject
        </button>
      </div>
    </div>
  );
};

export default User;
