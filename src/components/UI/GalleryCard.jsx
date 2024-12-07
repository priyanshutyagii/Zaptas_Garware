import React from "react";
import { useNavigate } from "react-router-dom"; // For navigation
import { FaCameraRetro } from "react-icons/fa";
import { HiArrowCircleRight } from "react-icons/hi";

export default function GalleryCard() {
  const navigate = useNavigate();

  // Sample gallery data
  const galleryItems = [
    { id: 1, title: "CSR Activities", image: "public/csrimg.PNG" },
    { id: 2, title: "Team Outing", image: "public/csrimg.PNG" },
    { id: 3, title: "Office Events", image: "public/csrimg.PNG" },
    { id: 4, title: "Annual Celebration", image: "public/csrimg.PNG" },
  ];

  // Navigate to details page with the selected item data
  const handleTitleClick = (item) => {
    navigate(`/gallery/${item.id}`, { state: item });
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
        <div className="gallery d-flex flex-wrap">
          {galleryItems.map((item) => (
            <div
              key={item.id}
              className="gallery-item text-center p-2"
              style={{ maxWidth: "150px" }}
            >
              <img
                src={item.image}
                alt={item.title}
                className="img-fluid rounded mb-2"
                style={{ maxHeight: "100px", objectFit: "cover" }}
              />
              <button
                className="btn btn-link p-0 text-primary"
                onClick={() => handleTitleClick(item)}
              >
                {item.title}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
