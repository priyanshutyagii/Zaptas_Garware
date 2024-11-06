import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AppLayout from "./components/Layout/AppLayout";

import "./App.css";

import About from "./pages/About";
import Quicklinks from "./pages/Quicklinks";
import Workplace from "./pages/Workplace";
import ErrorPage from "./pages/ErrorPage";
import Home from "./pages/Home";
import Login from "./pages/Login";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "about",
        element: <About />,
      },
      {
        path: "workplace",
        element: <Workplace />,
      },
      {
        path: "quicklinks",
        element: <Quicklinks />,
      },
      {
        path: "login",
        element: <Login />,
      },
    ],
  },
]);
function App() {
  return <RouterProvider router={router}> </RouterProvider>;
}

export default App;
