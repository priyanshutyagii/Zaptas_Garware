import React, { useEffect, useState } from "react";
import { FaSearch, FaHome, FaInfoCircle, FaBuilding } from "react-icons/fa";
import { RiLink } from "react-icons/ri";

import "./Header.css";
import { apiCall, getTokenFromLocalStorage } from "../../utils/apiCall";
import ConnectMe from "../../config/connect";

export default function Headers() {
  const [formData, setFormData] = useState({
    links: [{ title: '', link: '', id: '' }],
  });

  // Fetch quick links when the component mounts
  useEffect(() => {
    fetchQuickLinks();
  }, []);

  const fetchQuickLinks = async () => {
    try {
      const token = getTokenFromLocalStorage();
      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      };

      const response = await apiCall('GET', `${ConnectMe.BASE_URL}/qlink/quick-links`, headers);
      if (response.success) {
        const fetchedLinks = response?.data?.map((link) => ({
          id: link._id,  // Make sure to store the ID for each link
          title: link.title,
          link: link.url,
        }));
        setFormData({ links: fetchedLinks });
      } else {
        console.error('Error fetching quick links.');
      }
    } catch (error) {
      console.error('Error fetching quick links:', error);
      alert('Error fetching quick links');
    }
  };

  return (
    <header className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <a className="navbar-brand" href="/">
          <img src="./logo.png" alt="Logo" />
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
                  <FaHome className="navbar-icon" />
                  <span>Home</span>
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
              <ul className="dropdown-menu" aria-labelledby="quicklinksDropdown">
                {/* Dynamically render quick links from state */}
                {formData.links.map((link) => (
                  <li key={link.id}>
                    <a
                      className="dropdown-item"
                      href={link.link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {link.title}
                    </a>
                  </li>
                ))}
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
