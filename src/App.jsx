import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Suspense } from "react";
import { routes } from "./routes";
import Loader from "./components/loader";


const router = createBrowserRouter(routes);

function App() {
  return (
    <Suspense fallback={<Loader/>}>
      <RouterProvider router={router} />
    </Suspense>
  );
}

export default App;
