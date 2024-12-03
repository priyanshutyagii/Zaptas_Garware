import { lazy } from "react";
import ProtectedRoute from "./components/ProtectedRoute";
import AppLayout from "./components/Layout/AppLayout";
import AdminLayout from "./admin/AdminLayout";
import ErrorPage from "./pages/ErrorPage";
import PhotosVideos from "./admin/photosVideo";

const Home = lazy(() => import("./pages/Home"));
const About = lazy(() => import("./pages/About"));
const Quicklinks = lazy(() => import("./pages/Quicklinks"));
const Workplace = lazy(() => import("./pages/Workplace"));
const Login = lazy(() => import("./pages/Login"));
const AdminPanel = lazy(() => import("./admin/AdminPanel"));
const UploadBanners = lazy(() => import("./admin/UploadBanners"));
const Announcements = lazy(() => import("./admin/Announcements"));
const ViewAllPosts = lazy(() => import("./components/UI/ViewAllPosts"));

export const routes = [
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Home /> }, // Default route for "/"
      { path: "about", element: <About /> },
      { path: "workplace", element: <Workplace /> },
      { path: "quicklinks", element: <Quicklinks /> },
      { path: "view-all", element: <ViewAllPosts /> },
    ],
  },
  {
    path: "/admin",
    element: (
      <AdminLayout />
      // <ProtectedRoute haveAdminAccess={true}>
      //   <AdminLayout />
      // </ProtectedRoute>
    ),
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <AdminPanel /> }, // Default route for "/admin"
      { path: "upload-banners", element: <UploadBanners /> },
      { path: "announcements", element: <Announcements /> },
      { path: "photosVideo", element: <PhotosVideos /> },
    ],
  },
  { path: "/login", element: <Login /> },
];
