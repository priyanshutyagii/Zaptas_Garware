import React from "react";
import "./TopBar.css";
import { FaBell, FaUserCircle } from "react-icons/fa";

export default function TopBar() {
  return (
    <div className="top-bar">
      <div className="top-bar-left">
        <h2>Admin Panel</h2>
      </div>
      <div className="top-bar-right">
        <FaBell className="icon" />
        <FaUserCircle className="icon" />
      </div>
    </div>
  );
}
