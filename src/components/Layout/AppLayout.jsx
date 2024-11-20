
import Headers from "../UI/Headers";
import Footer from "../UI/Footer";
import { Outlet } from "react-router-dom";

export default function AppLayout() {
  return (
    <>
      <Headers />
      <Outlet />
      <Footer />
    </>
  );
}
