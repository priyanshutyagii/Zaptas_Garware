import React from "react";
import { FaSearch, FaHome, FaInfoCircle, FaBuilding } from "react-icons/fa";
import { RiLink } from "react-icons/ri";

import "./Header.css";
export default function Headers() {
  return (
    <header className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <a className="navbar-brand" href="/">
          <img src="\logo.PNG" alt="Logo" />
        </a>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <a className="nav-link" href="/">
                <div className="d-flex flex-column align-items-center">
                  <FaHome className="navbar-icon" /> {/* Top Icon */}
                  <span>Home</span> {/* Bottom Text */}
                </div>
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/about">
                <div className="d-flex flex-column align-items-center">
                  <FaInfoCircle className="navbar-icon" />
                  <span>About</span>
                </div>
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/workplace">
                <div className="d-flex flex-column align-items-center">
                  <FaBuilding className="navbar-icon " />
                  <span>Workplace</span>
                </div>
              </a>
            </li>
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle d-flex align-items-center"
                href="#"
                id="quicklinksDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <span className="d-flex flex-column align-items-center">
                  <RiLink className="navbar-icon me-1" />
                  <span>Quicklinks </span>
                </span>
              </a>
              <ul
                className="dropdown-menu"
                aria-labelledby="quicklinksDropdown"
              >
                <li>
                  <a className="dropdown-item" href="/quicklink1">
                    Quicklink 1
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="/quicklink2">
                    Quicklink 2
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="/quicklink3">
                    Quicklink 3
                  </a>
                </li>
              </ul>
            </li>
          </ul>

          <form className="d-flex search-form">
            <input
              className="form-control "
              type="search"
              placeholder="Search"
              aria-label="Search"
            />
            <button className="btn btn-success" type="submit">
              <FaSearch />
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
