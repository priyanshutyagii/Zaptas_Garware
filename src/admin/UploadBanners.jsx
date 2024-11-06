import React from "react";
import "./UploadBanners.css";

export default function UploadBanners() {
  return (
    <div className="upload-banners">
      <div className="banners-section">
        <h4>Current Banners</h4>
        <div className="banners-row">
          <div className="banner-card">
            <img
              src="public\banner1.jpg"
              alt="Banner 1"
              className="banner-image active"
            />
            <img
              src="public\banner1.jpg"
              alt="Banner 1"
              className="banner-image"
            />
            <img
              src="public\banner1.jpg"
              alt="Banner 1"
              className="banner-image"
            />
            <img
              src="public\banner1.jpg"
              alt="Banner 1"
              className="banner-image"
            />
            <img
              src="public\banner1.jpg"
              alt="Banner 1"
              className="banner-image"
            />
          </div>
        </div>

        <div className="banners-btn">
          <div className="banner-actions">
            <button
              type="button"
              className="btn btn-outline-primary btn-sm m-1"
            >
              Active
            </button>
            <button
              type="button"
              className="btn btn-outline-secondary btn-sm m-1"
            >
              Rename
            </button>
          </div>
          <div className="save-cancel">
            <button className="btn btn-danger save-btn btn-sm m-1">Save</button>
            <button className="btn btn-info cancel-btn btn-sm m-1">
              Cancel
            </button>
          </div>
        </div>
      </div>

      <div className="banners-section">
        <h4>Upload New Banners</h4>
        <input type="file" className="upload-input" multiple />

        <div className="banners-row">
          <div className="banner-card">
            <img
              src="public\banner1.jpg"
              alt="Banner 1"
              className="banner-image"
            />
          </div>
        </div>
        <div className="banners-btn">
          <div className="banner-actions">
            <button
              type="button"
              className="btn btn-outline-primary btn-sm m-1"
            >
              Active
            </button>
            <button
              type="button"
              className="btn btn-outline-secondary btn-sm m-1"
            >
              Rename
            </button>
          </div>
          <div className="save-cancel">
            <button className="btn btn-danger save-btn btn-sm m-1">Save</button>
            <button className="btn btn-info cancel-btn btn-sm m-1">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
