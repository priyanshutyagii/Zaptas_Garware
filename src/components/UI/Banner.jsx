import  { useState, useEffect } from "react";

import ConnectMe from "../../config/connect";
import { apiCall, getTokenFromLocalStorage } from "../../utils/apiCall";
import showToast from "../../utils/toastHelper";

export default function Banner() {
  const [banners, setBanners] = useState([]);

  // Fetch banners from the API
  const fetchBanners = async () => {
    try {
      const url = `${ConnectMe.BASE_URL}/banner/getFs?type=Banners&active=true`;
      const token = getTokenFromLocalStorage();

      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      const response = await apiCall("GET", url, headers);
      if (response.success) {
        setBanners(response.data);
       
      } else {
        setBanners([]);
        showToast("Failed to load banner", 'error')
      }
   
    } catch (error) {
      setBanners([]);
      showToast("Failed to load banner", 'error')
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  return (
    <div id="bannerCarousel" className="carousel slide" data-bs-ride="carousel">
      <div className="carousel-indicators">
        {banners.map((banner, index) => (
          <button
            key={banner._id}
            type="button"
            data-bs-target="#bannerCarousel"
            data-bs-slide-to={index}
            className={index === 0 ? "active" : ""}
            aria-current={index === 0 ? "true" : "false"}
            aria-label={`Slide ${index + 1}`}
          ></button>
        ))}
      </div>

      <div className="carousel-inner">
        {banners.map((banner, index) => (
          <div key={banner._id} className={`carousel-item ${index === 0 ? "active" : ""}`}>
            <img
              src={`${ConnectMe.BASE_URL}${banner.imagePath}`}
              className="d-block w-100"
              alt={`Banner ${index + 1}`}
            />
            <div className="carousel-caption d-none d-md-block">
              {/* <h5>{banner.title || `Slide ${index + 1} Title`}</h5> */}
              {/* <p>{banner.description || `Some description for slide ${index + 1}.`}</p> */}
            </div>
          </div>
        ))}
      </div>

      {/* Previous and Next controls */}
      <button
        className="carousel-control-prev"
        type="button"
        data-bs-target="#bannerCarousel"
        data-bs-slide="prev"
      >
        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Previous</span>
      </button>
      <button
        className="carousel-control-next"
        type="button"
        data-bs-target="#bannerCarousel"
        data-bs-slide="next"
      >
        <span className="carousel-control-next-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Next</span>
      </button>
    </div>
  );
}
