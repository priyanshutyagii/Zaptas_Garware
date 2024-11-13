import React, { useEffect, useState } from "react";
import "./UploadBanners.css";
import { apiCall, getTokenFromLocalStorage } from "../utils/apiCall";
import ConnectMe from "../config/connect";
import { toast } from 'react-toastify';
import showToast from "../utils/toastHelper";

export default function UploadBanners() {
  const [banners, setBanners] = useState([]);
  const [activeIndex, setActiveIndex] = useState(null);
  const [selectedImages, setSelectedImages] = useState([]);
  const [isBannerUpdated, setIsBannerUpdated] = useState(''); // Track banner update
  const fileInputRef = React.createRef();

  useEffect(() => {
    fetchBanners();
  }, [isBannerUpdated]); // Only re-fetch when isBannerUpdated changes

  const fetchBanners = async () => {
    try {
      const url = `${ConnectMe.BASE_URL}/banner/getFs?type=Banners`;
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
      console.error("Error fetching banners:", error.message);
    }
  };

  const toggleActiveState = async (index) => {
    try {
      setActiveIndex(activeIndex === index ? null : index);
    } catch (error) {
      console.error("Error toggling banner active state:", error.message);
    }
  };

  const deleteBanner = async (bannerId) => {
    try {
      const url = `${ConnectMe.BASE_URL}/admin/banners/${bannerId}`;
      const token = getTokenFromLocalStorage();

      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      const response = await apiCall("DELETE", url, headers);


      if (response.success) {
        showToast("Deleted", 'success')
      } else {

        showToast("Failed to delete banner", 'error')
      }

    } catch (error) {
      console.error("Error deleting banner:", error.message);
    }
  };

  const updateBannerStatus = async (bannerId) => {
    try {
      const url = `${ConnectMe.BASE_URL}/banner/banners/${bannerId}/toggle-status`;
      const token = getTokenFromLocalStorage();

      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      const response = await apiCall("PATCH", url, headers);
      if (response.success) {
        showToast("Banner status updated:", 'success')
        setIsBannerUpdated(!isBannerUpdated);  // Trigger banner update state
      } else {

        showToast("Failed to update banner", 'error')
      }



    } catch (error) {
      console.error("Error updating banner status:", error.message);
    }
  };

  const uploadBanner = async () => {
    if (!selectedImages || selectedImages.length === 0) {
      toast.error('Please select at least one banner image.');
      return;
    }

    try {
      const url = `${ConnectMe.BASE_URL}/file/upload`;
      const token = getTokenFromLocalStorage();

      const formData = new FormData();
      for (const image of selectedImages) {
        if (typeof image === 'string') {
          const response = await fetch(image);
          if (!response.ok) {
            toast.error(`Failed to fetch the image from URL: ${image}`);
            return;
          }
          const blob = await response.blob();
          const file = new File([blob], 'banner.jpg', { type: blob.type });
          formData.append('files', file);
        } else {
          formData.append('files', image);
        }
      }

      formData.append('name', 'Banners');

      const headers = {
        'Authorization': `Bearer ${token}`,
      };

      const response = await apiCall('POST', url, headers, formData);
      if (response.success) {
        showToast('Banner uploaded successfully!', 'success')
        setSelectedImages([]); // Clear images after upload
        setIsBannerUpdated(!isBannerUpdated);  // Trigger banner update state
        fileInputRef.current.value = null;
      } else {
        showToast("Failed to upload banner", 'error')
      }


    } catch (error) {
      console.error('Error uploading banner:', error.message);
      toast.error(`Error uploading banner: ${error.message || 'An unexpected error occurred'}`);
    }
  };

  const handleFileChange = (e) => {
    const files = e.target.files;
    const fileArray = Array.from(files).map(file => URL.createObjectURL(file));
    setSelectedImages(fileArray);
  };

  const handleCancel = () => {
    setSelectedImages([]);
    fileInputRef.current.value = null;
  };

  return (
    <div className="upload-banners container">
      {/* Current Banners Section */}
      <div className="banners-section mb-4">
        <h4>Current Banners</h4>
        <div className="row">
          {banners.length > 0 ? (
            banners.map((banner, index) => (
              <div key={banner._id} className="col-6 col-sm-3 mb-4">
                <div className="banner-card">
                  <img
                    src={`${ConnectMe.BASE_URL}${banner.imagePath}`}
                    alt={`Banner ${index + 1}`}
                    className={`banner-image ${activeIndex === index ? "active" : ""}`}
                    onClick={() => toggleActiveState(index, banner._id)}
                  />
                </div>

                <div className="banner-actions text-center">
                  <button
                    type="button"
                    className="btn btn-outline-primary btn-sm me-2"
                    onClick={() => updateBannerStatus(banner._id)}
                  >
                    {banner?.active ? "Mark as Inactive" : "Mark as Active"}
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() => deleteBanner(banner._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>No banners available.</p>
          )}
        </div>
      </div>

      {/* Upload New Banners Section */}
      <div className="banners-section">
        <h4>Upload New Banners</h4>
        <input
          type="file"
          className="form-control upload-input mb-3"
          multiple
          onChange={handleFileChange}
          ref={fileInputRef}
        />

        {selectedImages.length > 0 && (
          <div className="row">
            {selectedImages.map((image, index) => (
              <div key={index} className="col-6 col-sm-3 mb-4">
                <div className="banner-card">
                  <img
                    src={image}
                    alt={`Selected Banner ${index + 1}`}
                    className="banner-image"
                  />

                </div>
              </div>
            ))}
          </div>
        )}

        <div className="d-flex justify-content-between mt-3">
          <button
            className="btn btn-danger btn-sm"
            onClick={uploadBanner}
          >
            Upload
          </button>
          <button
            className="btn btn-info btn-sm"
            onClick={handleCancel}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
