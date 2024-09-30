import React from "react";
import { useSelector } from "react-redux";
import User from "./User";

const Friends = () => {
  const friends = useSelector((state) => state.friend.friends);

  return (
    <>
      <div className="">
        <h1 className="text-3xl font-semibold pb-5">My Friends</h1>
        <div className="flex flex-col items-start gap-y-5 overflow-y-auto no-scrollbar max-h-[83vh]">
          {friends?.map((user) => (
            <User key={user.id} friend={user} />
          ))}
        </div>
      </div>
    </>
  );
};

export default Friends;
