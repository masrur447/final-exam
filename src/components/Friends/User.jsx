import { getDatabase, ref, remove, update } from "firebase/database";
import { useDispatch, useSelector } from "react-redux";
import { useHref } from "react-router-dom";

import { useEffect } from "react";
import { setSingleUser } from "./../../feature/SingleUserSlice";

const User = ({ friend }) => {
  const pathname = useHref();
  const users = useSelector((state) => state.user.users);
  const singleUser = useSelector((state) => state.singleUser.user);
  const user = users.find(
    (f) => f.uid === friend.receiverId || f.uid === friend.senderId
  );
  const { uid } = useSelector((state) => state.user.user);
  const dispatch = useDispatch();

  if (!user) return null;

  const db = getDatabase();
  const { id, blocked } = friend;

  // handle block user
  const handleBlock = () => {
    update(ref(db, `friends/${id}`), {
      blocked: !blocked,
      blockedBy: !blocked ? uid : null,
    }).then(() => {
      dispatch(
        setSingleUser({
          ...user,
          blocked: !blocked,
          blockedBy: !blocked ? uid : null,
        })
      );
    });
  };

  // handle unfriend
  const handleUnfriend = () => {
    remove(ref(db, `friends/${id}`));
  };

  const selectUser = () => {
    if (pathname == "/messages") {
      dispatch(
        setSingleUser({
          ...user,
          blocked: blocked,
          blockedBy: blocked ? uid : null,
        })
      );
    }
  };

  useEffect(() => {
    if (!singleUser) return;
    if (pathname == "/messages") {
      dispatch(
        setSingleUser({
          ...user,
          blocked: blocked,
          blockedBy: blocked ? uid : null,
        })
      );
    }
  }, [friend?.blocked]);

  return (
    <div
      className={`flex justify-center items-center gap-x-5 ${
        pathname == "/messages" ? "cursor-pointer" : ""
      }`}
      onClick={selectUser}
    >
      <div className="w-[82px] h-[82px] bg-slate-600 rounded-full overflow-hidden">
        <img
          src={user?.photoURL || "https://i.pravatar.cc/200/200"}
          className="w-full h-full object-cover"
        />
      </div>
      <p className="text-black text-[23px] truncate font-Inter font-medium leading-7">
        {user?.name}
      </p>
      <div className="flex justify-center items-center gap-x-2">
        {friend?.blockedBy === uid ||
          (friend?.blockedBy == null && (
            <button
              className="bg-red-400 text-white text-sm rounded-md px-4 py-2 transition hover:bg-red-500"
              onClick={handleUnfriend}
            >
              Unfriend
            </button>
          ))}
        {blocked ? (
          <>
            {friend?.blockedBy === uid ? (
              <button
                className="bg-red-400 text-white text-sm rounded-md px-4 py-2 transition hover:bg-red-500"
                onClick={handleBlock}
              >
                UnBlock
              </button>
            ) : (
              <button
                className="bg-red-400 text-white text-sm rounded-md px-4 py-2 transition disabled:pointer-events-none hover:bg-red-500"
                disabled
              >
                Blocked
              </button>
            )}
          </>
        ) : (
          <button
            className="bg-red-400 text-white text-sm rounded-md px-4 py-2 transition hover:bg-red-500"
            onClick={handleBlock}
          >
            Block
          </button>
        )}
      </div>
    </div>
  );
};

export default User;
