import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // For navigation
import { FaCameraRetro } from "react-icons/fa";
import { HiArrowCircleRight } from "react-icons/hi";
import ConnectMe from "../../config/connect";
import { apiCall, getTokenFromLocalStorage } from "../../utils/apiCall";
import showToast from "../../utils/toastHelper";

export default function GalleryCard() {
  const navigate = useNavigate();
  const [data, setData] = useState({
    Announcements: [],
    CsrType: [],
    Awards: [],
  });

  useEffect(() => {
    fetchData("Announcements");
    fetchData("CsrType");
    fetchData("Awards");
  }, []);

  const fetchData = async (type) => {
    try {
      const url = `${ConnectMe.BASE_URL}/photosVideos/${type}?limit=3&page=1`; // Fetch multiple items for carousel
      const token = getTokenFromLocalStorage();
      const headers = { Authorization: `Bearer ${token}` };

      const response = await apiCall("GET", url, headers);
      if (response.success) {
        setData((prevData) => ({
          ...prevData,
          [type]: response.data?.data || [],
        }));
      } else {
        showToast(`Failed to load ${type}`, "error");
      }
    } catch (error) {
      console.error(`Error fetching ${type}:`, error.message);
      showToast(`Error fetching ${type}`, "error");
    }
  };

  const handleTitleClick = (item) => {
    navigate(`/gallery/${item.id}`, { state: item });
  };

  const renderCarousel = (items, section) => {
    if (!items || items.length === 0) return <p>No {section} available</p>;

    return (
      <div
        id={`${section}-carousel`}
        className="carousel slide"
        data-bs-ride="carousel"
      >
        <div className="carousel-inner">
          {items.map((item, index) => (
            <div
              key={item.id}
              className={`carousel-item ${index === 0 ? "active" : ""}`}
            >
              <img
                src={`${ConnectMe.img_URL}${item.imagePath}`}
                className="d-block w-100 rounded"
                alt={item.title}
                style={{ maxHeight: "200px", objectFit: "cover" }}
              />
              <div className="carousel-caption d-none d-md-block">
                <button
                  className="btn btn-link text-white p-0"
                  onClick={() => handleTitleClick(item)}
                >
                  {item.title}
                </button>
              </div>
            </div>
          ))}
        </div>
        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target={`#${section}-carousel`}
          data-bs-slide="prev"
        >
          <span
            className="carousel-control-prev-icon"
            aria-hidden="true"
          ></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button
          className="carousel-control-next"
          type="button"
          data-bs-target={`#${section}-carousel`}
          data-bs-slide="next"
        >
          <span
            className="carousel-control-next-icon"
            aria-hidden="true"
          ></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>
    );
  };

  return (
    <div className="card mb-3">
      <div className="card-header d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center">
          <FaCameraRetro className="me-2" />
          <h5 className="mb-0">Photo/Video Gallery</h5>
        </div>
        <a href="#" className="text-decoration-none">
          View All <HiArrowCircleRight />
        </a>
      </div>
      <div className="card-body">
        <div className="row">
          {/* Carousel for Announcements */}
          <div className="col text-center">
            <h6>Announcements</h6>
            {renderCarousel(data.Announcements, "Announcements")}
          </div>
          {/* Carousel for CSR */}
          <div className="col text-center">
            <h6>CSR</h6>
            {renderCarousel(data.CsrType, "CSR")}
          </div>
          {/* Carousel for Awards */}
          <div className="col text-center">
            <h6>Awards</h6>
            {renderCarousel(data.Awards, "Awards")}
          </div>
        </div>
      </div>
    </div>
  );
}
