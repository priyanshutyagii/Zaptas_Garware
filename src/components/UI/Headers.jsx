import { useState } from "react";
import { FaSearch, FaHome } from "react-icons/fa";
import { RiLink } from "react-icons/ri";
import "./Header.css";
import { useNavigate } from "react-router-dom";

export default function Headers() {
  const navigate = useNavigate();

  // Hardcoded data with third-level submenus
  const [formData, setFormData] = useState({
    links: [
      {
        id: "1",
        title: "Google",
        link: "https://www.google.com",
        subMenu: [
          {
            title: "Google Maps",
            link: "https://maps.google.com",
          },
          {
            title: "Google Drive",
            link: "https://drive.google.com",
          },
        ],
      },
      {
        id: "2",
        title: "Facebook",
        link: "https://www.facebook.com",
        subMenu: [
          { title: "Facebook Ads", link: "https://www.facebook.com/ads" },
          { title: "Facebook Messenger", link: "https://www.messenger.com" },
        ],
      },
      {
        id: "3",
        title: "LinkedIn",
        link: "https://www.linkedin.com",
        subMenu: [
          {
            title: "LinkedIn Learning",
            link: "https://www.linkedin.com/learning",
          },
          { title: "LinkedIn Jobs", link: "https://www.linkedin.com/jobs" },
        ],
      },
    ],
    menuItems: [
      {
        id: "1",
        title: "Home",
        link: "/",
        subMenu: [
          {
            title: "Sub Home 1",
            link: "/home1",
            thirdLevelSubMenu: [
              { title: "Details 1", link: "/home1/details1" },
              { title: "Details 2", link: "/home1/details2" },
            ],
          },
          { title: "Sub Home 2", link: "/home2" },
        ],
      },
      {
        id: "2",
        title: "About Us",
        link: "/about",
        subMenu: [
          { title: "Our Story", link: "/about/our-story" },
          { title: "Team", link: "/about/team" },
        ],
      },
      {
        id: "3",
        title: "Contact",
        link: "/contact",
        subMenu: [
          { title: "Contact Form", link: "/contact/form" },
          { title: "Support", link: "/contact/support" },
        ],
      },
    ],
  });

  const renderThirdLevelSubMenu = (thirdLevelSubMenu) => {
    return (
      <ul className="dropdown-menu">
        {thirdLevelSubMenu.map((item, index) => (
          <li key={index}>
            <a
              className="dropdown-item"
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
            >
              {item.title}
            </a>
          </li>
        ))}
      </ul>
    );
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
            {/* Home Link */}
            <li className="nav-item">
              <a className="nav-link" onClick={() => navigate("/")}>
                <div className="d-flex flex-column align-items-center">
                  <FaHome className="navbar-icon" />
                  <span>Home</span>
                </div>
              </a>
            </li>

            {/* Quick Links Dropdown */}
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
                  <span>Quicklinks</span>
                </span>
              </a>
              <ul
                className="dropdown-menu"
                aria-labelledby="quicklinksDropdown"
              >
                {formData.links.map((link) => (
                  <li key={link.id} className="dropdown-submenu">
                    <a
                      className="dropdown-item"
                      href={link.link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {link.title}
                    </a>
                    {link.subMenu && (
                      <ul className="dropdown-menu">
                        {link.subMenu.map((subLink, index) => (
                          <li key={index} className="dropdown-submenu">
                            <a
                              className="dropdown-item"
                              href={subLink.link}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {subLink.title}
                            </a>
                            {subLink.thirdLevelSubMenu &&
                              renderThirdLevelSubMenu(
                                subLink.thirdLevelSubMenu
                              )}
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            </li>

            {/* Menu Dropdown */}
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle d-flex align-items-center"
                href="#"
                id="menuDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <span className="d-flex flex-column align-items-center">
                  <RiLink className="navbar-icon me-1" />
                  <span>Menu</span>
                </span>
              </a>
              <ul className="dropdown-menu" aria-labelledby="menuDropdown">
                {formData.menuItems.map((item) => (
                  <li key={item.id} className="dropdown-submenu">
                    <a
                      className="dropdown-item"
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {item.title}
                    </a>
                    {item.subMenu && (
                      <ul className="dropdown-menu">
                        {item.subMenu.map((subItem, index) => (
                          <li key={index} className="dropdown-submenu">
                            <a
                              className="dropdown-item"
                              href={subItem.link}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {subItem.title}
                            </a>
                            {subItem.thirdLevelSubMenu &&
                              renderThirdLevelSubMenu(
                                subItem.thirdLevelSubMenu
                              )}
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            </li>
          </ul>

          <form className="d-flex search-form">
            <input
              className="form-control"
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
