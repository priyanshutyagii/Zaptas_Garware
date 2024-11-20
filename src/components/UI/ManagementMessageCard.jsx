import React from "react";
import { FaEnvelope } from "react-icons/fa";
import { HiArrowCircleRight } from "react-icons/hi";
import "./ManagementCard.css";

export default function ManagementMessageCard() {
  return (
    <div className="card mb-3">
      <div className="card-header d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center">
          <FaEnvelope className="me-2" />
          <h5 className="mb-0">Management Message</h5>
        </div>
      </div>
      <div className="card-body mgt-card">
        <div className="card-content">
          <div className="d-flex align-items-end">
            <div className="image-section" style={{ width: "50%" }}>
              <img
                src="https://png.PNGtree.com/png-vector/20231116/ourmid/pngtree-office-worker-with-laptop-png-image_10451263.PNG"
                alt="Management"
                className="img-fluid"
              />
            </div>
            <div className="content-section" style={{ width: "50%" }}>
              <h6>Message Title</h6>
              <p className="card-text">
                A brief description of the message from the management team.
                This is where the key.
              </p>
              <a href="#" className="text-decoration-none read-more">
                Read More +
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
