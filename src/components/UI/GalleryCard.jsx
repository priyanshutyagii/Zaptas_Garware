import React from "react";
import { FaCameraRetro } from "react-icons/fa";
import { HiArrowCircleRight } from "react-icons/hi";

export default function GalleryCard() {
  return (
    <div className="card mb-3">
      <div className="card-header d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center">
          <FaCameraRetro className="me-2" />
          <h5 className="mb-0">Photo/Video Gallery </h5>
        </div>
        <a href="#" className="text-decoration-none">
          View All <HiArrowCircleRight />
        </a>
      </div>
      <div className="card-body">
        <div>
          <div className="d-flex align-items-start">
            <div className="galley">
              <img src="\csrimg.PNG" className="p-1" alt="CSR" />
              <img src="\csrimg.PNG" className="p-1" alt="CSR" />
              <img src="\csrimg.PNG" className="p-1" alt="CSR" />
              <img src="\csrimg.PNG" className="p-1" alt="CSR" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
