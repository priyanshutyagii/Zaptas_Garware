import { useState, useEffect } from "react";

import { HiArrowCircleRight } from "react-icons/hi";
import { AiOutlineSound } from "react-icons/ai";
import { Modal, Spinner } from "react-bootstrap";
import { FaThumbsUp } from "react-icons/fa";
import "./AnnouncementCard.css";
import ConnectMe from "../../config/connect";
import { apiCall, getTokenFromLocalStorage } from "../../utils/apiCall";
import showToast from "../../utils/toastHelper";

export default function AnnouncementCard() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [show, setShow] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);


  // Fetch announcements on component mount
  useEffect(() => {
    fetchAnnouncements();
  }, []);




  const fetchAnnouncements = async (page = 1, limit = 3) => {
    try {
      setLoading(true); // Show loader while fetching
      const url = `${ConnectMe.BASE_URL}/announcements/latest?page=${page}&limit=${limit}`;
      const token = getTokenFromLocalStorage();
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      const response = await apiCall("GET", url, headers);
      if (response.success) {
        setAnnouncements(response?.data?.announcements);

      } else {
        setError("Failed to fetch announcements.");
      }
    } catch (err) {
      setError("Error fetching announcements.");
    } finally {
      setLoading(false); // Hide loader after fetching
    }
  };

  // Handle like/unlike
  const handleLikeDislike = async (announcementId, isLiked) => {
    showToast(isLiked ? "unlike success" : "like success",'success')
    const token = getTokenFromLocalStorage();
    const url = `${ConnectMe.BASE_URL}/announcements/${announcementId}/${isLiked ? "unlike" : "like"}`;
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };

    try {
      const response = await apiCall("POST", url, headers);
      if (response.success) {
     
        // Update the local state to reflect the like/unlike action
        setAnnouncements((prevAnnouncements) =>
          prevAnnouncements.map((announcement) => {
            if (announcement._id === announcementId) {
              // Update the likes array and the likesCount locally
              const updatedLikes = isLiked
                ? announcement.likes.filter(userId => userId !== response.userId)
                : [...announcement.likes, response.userId];

              return {
                ...announcement,
                likes: updatedLikes,
                likesCount: updatedLikes.length,  // Update the likes count directly
                likedByUser: !isLiked,  // Toggle the likedByUser state
              };
            }
            return announcement; // Return the unchanged announcement if not matching
          })
        );
      } else {
        setError("Failed to update like.");
      }
    } catch (err) {
      setError("Error updating like.");
    }
  };


  const handleClose = () => setShow(false);
  const handleShow = (announcement) => {
    setSelectedAnnouncement(announcement);
    setShow(true);
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (error) {
    return <div className="text-danger text-center mt-5">{error}</div>;
  }

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
          {announcements.map((announcement) => (
            <div
              className="mb-3 announcement-card"
              key={announcement._id}
              onClick={() => handleShow(announcement)} // Open modal when clicking the card
              style={{ cursor: "pointer" }}
            >
              <div className="d-flex align-items-start">
                {/* Date Badge */}
                <div className="date-badge-container">
                  <div className="date-badge">
                    {new Date(announcement.createdAt).toLocaleString("default", {
                      month: "short",
                    })}{" "}
                    {new Date(announcement.createdAt).getFullYear()}
                  </div>
                  <span className="date">
                    {new Date(announcement.createdAt).getDate()}
                  </span>
                </div>

                {/* Announcement Content */}
                <div className="announcement-disc">
                  <p className="card-text">{announcement.title}</p>
                  <p
                    className="like-section"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent triggering `handleShow`
                      handleLikeDislike(announcement._id, announcement.likedByUser);
                    }}
                  >
                    <FaThumbsUp
                      style={{
                        color: announcement.likedByUser ? "blue" : "gray",
                        cursor: "pointer",
                      }}
                    />{" "}
                    {announcement?.likes?.length}
                  </p>
                  <a
                    href="#"
                    className="text-decoration-none"
                  
                  >
                    Read More +
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Popup Modal */}
      {selectedAnnouncement && (
        <Modal show={show} onHide={handleClose} centered>
          <Modal.Header closeButton>
            <Modal.Title>{selectedAnnouncement.title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="d-flex justify-content-between align-items-center mb-4">
              {/* Left Div */}
              <div>
                <h6 className="mb-1">{selectedAnnouncement.fullName}</h6>
                <p className="mb-0 text-muted">
                  {selectedAnnouncement.Designation}
                </p>
              </div>
              {/* Right Div */}
              <div>
                <img
                  src={`${ConnectMe.img_URL}${selectedAnnouncement?.images?.imagePath}`}
                  alt="User"
                  className="rounded-circle"
                  style={{ width: "50px", height: "50px" }}
                />
              </div>
            </div>

            {/* Description */}
            <div
              style={{
                maxHeight: "200px",
                overflowY: "auto",
                border: "1px solid #ddd",
                padding: "10px",
                borderRadius: "5px",
              }}
            >
              <p
                dangerouslySetInnerHTML={{
                  __html: selectedAnnouncement.description.replace(/\n/g, "<br />"),
                }}
              />
            </div>

            {selectedAnnouncement.links.map((link) => (
              <div key={link._id} style={{ marginBottom: "16px", display: "flex", flexDirection: "column" }}>
                <a
                  href={link.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textDecoration: "none", color: "#007bff" }}
                >
                  <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                    <strong style={{ fontSize: "16px", marginRight: "8px" }}>{link.linkTitle}</strong>
                    <span style={{ fontStyle: "italic", color: "#555" }}>{link.link}</span>
                  </div>
                </a>
              </div>
            ))}

            <p className="mt-3">
              <strong>
                Location: {selectedAnnouncement.location || "N/A"}
              </strong>
            </p>

            {/* Like Button */}
            <div className="d-flex align-items-center">
              <FaThumbsUp
                onClick={() => handleLikeDislike(selectedAnnouncement._id, selectedAnnouncement.likedByUser)}
                style={{
                  color: selectedAnnouncement.likedByUser ? "blue" : "gray",
                  cursor: "pointer",
                  marginRight: "8px",
                }}
              />
              <span>  {selectedAnnouncement?.likes?.length} Likes</span> {/* Display likes count */}
            </div>
          </Modal.Body>
        </Modal>
      )}
    </div>
  );
}
