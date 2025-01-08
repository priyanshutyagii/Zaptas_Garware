import { useEffect, useState } from "react";
import { RiLink } from "react-icons/ri";
import { FaHome, FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn,FaUsers, FaLaptopCode, FaUserTie } from "react-icons/fa"
import "./Header.css";
import { useNavigate } from "react-router-dom";
import { FiChevronDown } from "react-icons/fi";
import { apiCall, getTokenFromLocalStorage } from "../../utils/apiCall";
import ConnectMe from "../../config/connect";

export default function Headers() {
  const navigate = useNavigate();

  useEffect(() => {
    fetchQuickLinks();
  }, []);

  // Hardcoded data with third-level submenus
  const [formData, setFormData] = useState({
    links: [
      {
        id: "1",
        title: "M1",
        // link: "https://www.google.com",
        subMenu: [
          {
            title: "Policy",
            link: "https://maps.google.com",
          },
          {
            title: "HelpDesk",
            link: "https://drive.google.com",
          },
        ],
      },
      {
        id: "2",
        title: "M2",
        link: "https://www.facebook.com",
        subMenu: [
          { title: "Facebook Ads", link: "https://www.facebook.com/ads" },
          { title: "Facebook Messenger", link: "https://www.messenger.com" },
        ],
      },
      {
        id: "3",
        title: "M3",
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
  });

  const fetchQuickLinks = async () => {
    try {
      const token = getTokenFromLocalStorage();
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      const response = await apiCall(
        "GET",
        `${ConnectMe.BASE_URL}/qlink/quick-links`,
        headers
      );

      if (response.success) {
        const fetchedLinks = response?.data?.map((link) => ({
          id: link._id, // Ensure unique ID for each link
          title: link.title,
          link: link.url,
        }));
        let dataSet = {
          title: "Quick Links",
          subMenu: fetchedLinks,
        };

        // Combine fetched links with the existing hardcoded links
        setFormData((prevState) => ({
          ...prevState,
          links: [...prevState.links, dataSet],
        }));
      } else {
        console.error("Error fetching quick links.");
      }
    } catch (error) {
      console.error("Error fetching quick links:", error);
      alert("Error fetching quick links");
    }
  };

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
                <FaUsers className="navbar-icon me-1" />
                  <span>HR</span>
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
                      {link.subMenu && (
                        <FiChevronDown className="submenu-arrow" />
                      )}
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
                <FaLaptopCode className="navbar-icon me-1" />
                  <span>IT</span>
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
                      {link.subMenu && (
                        <FiChevronDown className="submenu-arrow" />
                      )}
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
                <FaUserTie className="navbar-icon me-1" />
                  <span>Accounts</span>
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
                      {link.subMenu && (
                        <FiChevronDown className="submenu-arrow" />
                      )}
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
          </ul>

          <div className="d-flex social-icons">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-dark mx-2"
            >
              <FaFacebookF size={20} />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-dark mx-2"
            >
              <FaTwitter size={20} />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-dark mx-2"
            >
              <FaInstagram size={20} />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-dark mx-2"
            >
              <FaLinkedinIn size={20} />
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
