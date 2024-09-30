import { getAuth } from "firebase/auth";
import React from "react";
import { useDispatch } from "react-redux";
import { NavLink } from "react-router-dom";
import { toast } from "react-toastify";
import { logout as SignOut } from "./../../feature/UserSlice";
import { Icons } from "./../../icons/Index";
import Profile from "./../Profile/Index";

const Sidebar = () => {
  const auth = getAuth();
  const dispatch = useDispatch();

  const logout = async () => {
    await auth.signOut();
    dispatch(SignOut());

    toast.success("Logout Successful");
  };
  return (
    <div className="bg-[#5E3493]">
      <div className="flex flex-col items-center justify-around h-full">
        {/* profile */}
        <Profile />

        {/* menus */}
        <div className="flex flex-col justify-center items-center gap-y-12 w-full">
          <NavLink
            to="/"
            className="text-white grid items-center justify-center w-full py-2 [&.active]:border-r-4 border-white"
          >
            <Icons.House />
          </NavLink>
          <NavLink
            to="/messages"
            className="text-white grid items-center justify-center w-full py-2 [&.active]:border-r-4 border-white"
          >
            <Icons.Message />
          </NavLink>
        </div>
        {/* sign-out */}
        <div
          className="flex justify-center items-center gap-x-2 cursor-pointer w-full"
          onClick={logout}
        >
          <span className="text-white">
            <Icons.Logout />
          </span>
          <p className="text-white font-semibold text-sm leading-3">Sign Out</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
