// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";
import "./ViewAllPopup.css";

export default function ViewAllPopup({ title, leftContent, rightImages, show, onClose }) {
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription);
  };

  return (
    <Modal show={show} onHide={onClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="row">
          {/* Left Column */}
          <div className="col-md-6">
            <div className="content-box">
              <h5>{leftContent.title}</h5>
              <span className={`description ${showFullDescription ? "full" : "ellipsis"}`}>
                {leftContent.description}
              </span>
              {!showFullDescription && (
                <button className="btn btn-link p-0" onClick={toggleDescription}>
                  Read More
                </button>
              )}
              <div className="additional-info mt-1">
                <a href={leftContent.facebookLink} target="_blank" rel="noopener noreferrer">
                  Intranet: https://intranet.com
                </a><br></br>
                <span>Location: {leftContent.location}</span> &nbsp;
                <span>Date: {leftContent.date}</span>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="col-md-6">
            <div className="image-slider">
              {rightImages.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`slide-${index}`}
                  className="slider-image"
                  onClick={() => setSelectedImage(image)}
                />
              ))}
            </div>
          </div>
        </div>
      </Modal.Body>

      {/* Full Image View */}
      {selectedImage && (
        <div className="image-preview-overlay" onClick={() => setSelectedImage(null)}>
          <img src={selectedImage} alt="Full View" className="full-size-image" />
        </div>
      )}
    </Modal>
  );
}

// Define PropTypes
ViewAllPopup.propTypes = {
    title: PropTypes.string.isRequired,
    leftContent: PropTypes.shape({
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      facebookLink: PropTypes.string.isRequired,
      location: PropTypes.string.isRequired,
      date: PropTypes.string.isRequired,
    }).isRequired,
    rightImages: PropTypes.arrayOf(PropTypes.string).isRequired,
    show: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
  };
