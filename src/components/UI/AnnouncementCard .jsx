import React, { useState } from "react";
import { HiArrowCircleRight } from "react-icons/hi";
import "./AnnouncementCard.css";
import { AiOutlineSound } from "react-icons/ai";
import { Modal, Button } from "react-bootstrap";
import { FaThumbsUp } from "react-icons/fa";

export default function AnnouncementCard() {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <div>
      <div className="card mb-3">
        <div className="card-header d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <AiOutlineSound className="me-2" />
            <h5 className="mb-0">Announcements</h5>
          </div>
          <a href="#" className="text-decoration-none">
            View All <HiArrowCircleRight />
          </a>
        </div>
        <div className="card-body">
          <div className="mb-3">
            <div className="d-flex align-items-start">
              <div className="date-badge-container">
                <div className="date-badge">Oct 2023</div>
                <span className="date">26</span>
              </div>
              <div className="announcement-disc">
                <p className="card-text">Organisation Announcement 5Aug 23</p>
                <p>
                  <FaThumbsUp
                    style={{
                      color: "gray",
                      cursor: "pointer",
                    }}
                  />{" "}
                  8
                </p>
                <a onClick={handleShow} className="text-decoration-none">
                  Read More +
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Popup Modal */}
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Announcement Title</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Left and Right Div */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            {/* Left Div */}
            <div>
              <h6 className="mb-1">John Doe</h6>
              <p className="mb-0 text-muted">Senior Manager</p>
            </div>

            {/* Right Div */}
            <div>
              <img
                src="public/user.png"
                alt="User"
                className="rounded-circle"
                style={{ width: "50px", height: "50px" }}
              />
            </div>
          </div>

          {/* Description / Message */}
          <div
            style={{
              maxHeight: "200px",
              overflowY: "auto",
              border: "1px solid #ddd",
              padding: "10px",
              borderRadius: "5px",
            }}
          >
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin
              vehicula, urna vel tempor tincidunt, nulla nunc fermentum massa,
              ut consectetur nulla lacus id risus. Suspendisse potenti. Vivamus
              vehicula urna in justo posuere, sed efficitur nisi sodales.
            </p>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean
              fringilla nisi vitae nisl aliquam fermentum.
            </p>
          </div>

          {/* Line Text */}
          <p className="mt-3">
            <strong>
              Please join me in wishing Mr. Seth another successful tenure with
              us.
            </strong>
          </p>

          {/* Like Button */}
          <div className="d-flex align-items-center">
            <FaThumbsUp
              style={{
                color: "gray",
                cursor: "pointer",
                marginRight: "8px",
              }}
            />
            <span> Likes</span>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
