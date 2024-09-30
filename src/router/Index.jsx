import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";

import RootLayout from "./../layouts/RootLayout.jsx";
import Home from "./../pages/Home.jsx";
import Login from "./../pages/Login.jsx";
import Messages from "./../pages/Messages.jsx";
import Register from "./../pages/Register.jsx";
import GuestRoute from "./../PrivateRoutes/GuestRoute.jsx";
import LoggedInRuote from "./../PrivateRoutes/LoggedInRuote.jsx";

export const Router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route element={<RootLayout />}>
        <Route element={<LoggedInRuote />}>
          <Route path="/" element={<Home />} />
          <Route path="/messages" element={<Messages />} />
        </Route>
      </Route>

      <Route element={<GuestRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>
    </Route>
  )
);
