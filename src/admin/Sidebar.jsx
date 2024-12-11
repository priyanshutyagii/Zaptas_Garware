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
import { Link } from "react-router-dom";





export default function Sidebar() {
  return (
    <div className="sidebar">
      <ul className="sidebar-menu">
        <li>
        <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            <FaUsers /> <span>Home</span>
          </Link>
        </li>
        <li>
          <Link to="/admin/upload-banners" style={{ textDecoration: 'none', color: 'inherit' }}>
            <FaUsers /> <span>upload-banners</span>
          </Link>
        </li>
        <li>
          <Link to="/admin/announcements" style={{ textDecoration: 'none', color: 'inherit' }}>
            <FaUsers /> <span>Announcements</span>
          </Link>
        </li>
        <li>
          <Link to="/admin/csr" style={{ textDecoration: 'none', color: 'inherit' }}>
            <FaUsers /> <span>CSR</span>
          </Link>
        </li>
        <li>
          <Link to="/admin/industry" style={{ textDecoration: 'none', color: 'inherit' }}>
            <FaUsers /> <span>Industry News</span>
          </Link>
        </li>
        <li>
          <Link to="/admin/photosVideo" style={{ textDecoration: 'none', color: 'inherit' }}>
            <FaUsers /> <span>Photos-Videos</span>
          </Link>
        </li>
        <li>
          <Link to="/admin/qlink" style={{ textDecoration: 'none', color: 'inherit' }}>
            <FaUsers /> <span>Quick Links</span>
          </Link>
        </li>
        <li>
          <Link to="/admin/ManagementMessage" style={{ textDecoration: 'none', color: 'inherit' }}>
            <FaUsers /> <span>Management Message</span>
          </Link>
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
