import React from "react";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import "./AdminLayout.css";
import { Outlet } from "react-router-dom";

export default function AdminLayout({ children }) {
  return (
    <div className="admin-layout">
      <Sidebar />
      <div className="main-content">
        <TopBar />
        <div className="content-body">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
