import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const GuestRoute = () => {
  const user = useSelector((state) => state.user.user);
  if (user) return <Navigate to={"/"} />;
  else return <Outlet />;
};

export default GuestRoute;
