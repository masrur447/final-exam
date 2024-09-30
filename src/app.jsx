import { RouterProvider } from "react-router-dom";
import Toastify from "./components/Toastify/Index.jsx";
import { Router } from "./router/Index.jsx";

export default function App() {
  return (
    <>
      <Toastify />
      <RouterProvider router={Router} />
    </>
  );
}
