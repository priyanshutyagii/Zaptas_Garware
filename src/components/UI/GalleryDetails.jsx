import React from "react";
import { useLocation } from "react-router-dom";

export default function GalleryDetails() {
  const location = useLocation();
  const { state } = location; // Access the item data passed from GalleryCard
  const { title, image } = state;

  // Simulating related images
  const relatedImages = [
    { id: 1, image: "../csrimg.PNG" },
    { id: 2, image: "../csrimg.PNG" },
    { id: 3, image: "../csrimg.PNG" },
    { id: 4, image: "../csrimg.PNG" },
  ];

  return (
    <div className="container mt-4">
      <h3>{title}</h3>
      <div className="row mt-3">
        {relatedImages.map((img, index) => (
          <div key={index} className="col-md-3 mb-3">
            <img
              src={img.image}
              alt={`${title} ${index + 1}`}
              className="img-fluid rounded"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
