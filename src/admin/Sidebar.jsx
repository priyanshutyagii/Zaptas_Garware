import React from "react";
import "./Sidebar.css";
import {
  FaTachometerAlt,
  FaImages,
  FaUsers,
  FaServicestack,
  FaFileInvoice,
  FaCog,
  FaSignOutAlt,
  FaQuestionCircle,
} from "react-icons/fa";

export default function Sidebar() {
  return (
    <div className="sidebar">
      <ul className="sidebar-menu">
        <li>
          <FaTachometerAlt /> <span>Dashboard</span>
        </li>
        <li>
          <FaImages /> <span>Upload Banners</span>
        </li>
        <li>
          <FaUsers /> <span>Customer</span>
        </li>
        <li>
          <FaServicestack /> <span>Services</span>
        </li>
        <li>
          <FaFileInvoice /> <span>Tax Reports</span>
        </li>
        <li>
          <FaFileInvoice /> <span>PO Create</span>
        </li>
        <li>
          <FaFileInvoice /> <span>Invoice PO Create</span>
        </li>
        <li>
          <FaCog /> <span>Setting</span>
        </li>
        <li>
          <FaQuestionCircle /> <span>Help and Support</span>
        </li>
        <li>
          <FaSignOutAlt /> <span>Logout</span>
        </li>
      </ul>
    </div>
  );
}
