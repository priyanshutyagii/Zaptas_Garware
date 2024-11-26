import React, { useState } from "react";
import "./Announcements.css";
import { apiCall, getTokenFromLocalStorage } from "../utils/apiCall";
import ConnectMe from "../config/connect";
import showToast from "../utils/toastHelper";
import { FaPlusCircle, FaTimesCircle } from 'react-icons/fa';
export default function Announcements() {
  const [selectedImages, setSelectedImages] = useState([]); // Initializing the state for selected images

  const [formData, setFormData] = useState({


    title: "",
    location: "",
    description: "",
    images: '',
    fullName:"",
    Designation: "",
    name: 'announcement',
    links: [{ linkTitle: '', link: '' }],


  });



  const handleChange = (e) => {
    const { id, value, type, files } = e.target;

    // If the input is a file input, handle it separately
    if (type === "file") {
      const fileUrl = URL.createObjectURL(files[0]); // Create a preview URL for the selected image

      // Update formData and selectedImages state
      setFormData({
        ...formData,
        images: [files[0]], // Store the actual file in images
      });

      setSelectedImages([fileUrl]); // Store the preview URL in an array
    } else {
      // Handle regular text inputs
      setFormData({
        ...formData,
        [id]: value, // Update value for regular text inputs
      });
    }
 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Create a new FormData object
    const formDataToSubmit = new FormData();
  
    // Append other fields
    formDataToSubmit.append('title', formData.title);
    formDataToSubmit.append('location', formData.location);
    formDataToSubmit.append('description', formData.description);
    formDataToSubmit.append('Designation', formData.Designation);
    formDataToSubmit.append('name', formData.name);
    formDataToSubmit.append('links', JSON.stringify(formData.links)); // Convert links array to a string
  
    // Append the real image file
    if (formData.images) {
      formDataToSubmit.append('images', formData.images); // Assuming `images` is a File object
    }
  
    // Define headers (no need for Content-Type with FormData)
    const token = getTokenFromLocalStorage();
    const headers = {
      Authorization: `Bearer ${token}`,
    };
  
    // Make the API call
    const url = `${ConnectMe.BASE_URL}/announcements/create`;
    const result = await apiCall('POST', url, headers, formDataToSubmit, true);
  
    if (result.status) {
      console.log('Announcement saved successfully:', result.data);
  
      // Reset the form
      setFormData({
        title: "",
        location: "",
        description: "",
        images: null,
        Designation: "",
        name: "announcement",
        links: [{ linkTitle: "", link: "" }],
      });
    } else {
      console.error('Error saving announcement:', result.message);
    }
  };
  
  

const uploadImageAnnouncement = async () => {
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
          showToast(`Failed to fetch the image from URL: ${image}`, 'error');
          return;
        }
        const blob = await response.blob();
        const fileName = image.split('/').pop();  // Extracts the file name from the URL
        const file = new File([blob], fileName, { type: blob.type });

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

const handleAddLink = () => {
  const lastLink = formData.links[formData.links.length - 1];
  if (!lastLink.linkTitle || !lastLink.link) {
    alert('Please fill in both the Link Title and Link before adding a new one.');
    return;
  }

  setFormData({
    ...formData,
    links: [...formData.links, { linkTitle: '', link: '' }], // Add new empty link pair
  });
};

// Remove a specific link field set
const handleRemoveLink = (index) => {
  if (formData.links.length > 1) {
    const newLinks = formData.links.filter((_, i) => i !== index);
    setFormData({ ...formData, links: newLinks });
  }
};



const handleAddLinkchange = (index, e) => {
  const { name, value } = e.target;
  const newLinks = [...formData.links];
  newLinks[index][name] = value; // Update the value of the specific input field at that index
  setFormData({ ...formData, links: newLinks });
  console.log(formData)
};

return (
  <div className="admin-announcements">
    <h2>Announcements</h2>

    <div className="old-announcements">
      <h4>Old Announcements</h4>
      <ul>
        <li>Announcement 1</li>
        <li>Announcement 2</li>
        <li>Announcement 3</li>
      </ul>
      <div className="announcement-actions">
        <button className="view-btn">View</button>
        <button className="update-btn">Update</button>
        <button className="delete-btn">Delete</button>
        <button className="activate-btn">Activate</button>
        <button className="deactivate-btn">Deactivate</button>
        <button className="like-btn">Like</button>
      </div>
    </div>

    <hr></hr>
    {/* New Announcements Section */}
    <div className="new-announcements">
      <h4>New Announcement</h4>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Announcement Title</label>
          <input
            type="text"
            id="title"
            required
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter announcement title"
          />
        </div>

        <div className="form-group">
          <label htmlFor="manager">Your Full Name</label>
          <input
            type="text"
            id="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Kushagra Kamal"
          />
        </div>

        <div className="form-group">
          <label htmlFor="manager">Your Designation</label>
          <input
            type="text"
            id="Designation"
            value={formData.Designation}
            onChange={handleChange}
            placeholder="Assistant Manager - Accounts"
          />
        </div>

        <div className="form-group">
          <label htmlFor="location">Your Location</label>
          <input
            type="text"
            id="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Chhatrapati Sambhajinagar (Maharashtra)"
          />
        </div>

        {/* <div className="form-group">
        <label htmlFor="reporting">Reporting To</label>
        <input
          type="text"
          id="reporting"
          value={formData.reporting}
          onChange={handleChange}
          placeholder="Mr. Amit Dargad (Senior General Manager, Accounts)"
        />
      </div> */}

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter description"
          ></textarea>
        </div>

        <div className="form-group">
          <label htmlFor="profile-image">Profile Image</label>
          <input
            type="file"
            id="profile-image"
            onChange={handleChange}
          />
        </div>


        <div className="row">
          {selectedImages && selectedImages.length > 0 && selectedImages.map((image, index) => (
            <div key={index} className="col-6 col-sm-3 mb-4 position-relative">
              <div className="banner-card">
                <img
                  src={image} // Use the URL from the selectedImages array
                  alt={`Selected Banner ${index + 1}`}
                  className="banner-image"
                />
                {/* Cross icon in the top-right corner */}
                <div
                  className="delete-icon"
                  onClick={(() => {
                    setSelectedImages([])
                  })}
                  style={{ cursor: 'pointer' }}
                >
                  <FaTimesCircle style={{ color: 'red', fontSize: '24px' }} />
                </div>
              </div>
            </div>
          ))}
        </div>







        {/* <div className="form-group">
        <label>Upload Images</label>
        <input type="file" onChange={handleChange} />
        <input type="file" onChange={handleChange} />
        <input type="file" onChange={handleChange} />
      </div> */}
        {/* 
      <div className="form-group">
        <label htmlFor="message">Message</label>
        <textarea
          id="message"
          value={formData.message}
          onChange={handleChange}
          placeholder="Enter welcome message"
        ></textarea>
      </div> */}


        {formData.links.map((link, index) => (
          <div className="form-group d-flex" key={index}>
            <div className="col-2">
              <label htmlFor={`link-title-${index}`}>Link Title</label>
              <input
                id={`link-title-${index}`}
                name="linkTitle" // Use "linkTitle" for the name of the input
                value={link.linkTitle} // The value comes from the formData.links[index]
                onChange={(e) => handleAddLinkchange(index, e)} // Update the specific field in the links array
              />
            </div>

            <div className="col-8">
              <label htmlFor={`Links-${index}`}>Links</label>
              <input
                id={`Links-${index}`}
                name="link" // Use "link" for the name of the input
                value={link.link} // The value comes from the formData.links[index]
                onChange={(e) => handleAddLinkchange(index, e)} // Update the specific field in the links array
              />
            </div>

            {/* Add link icon */}
            <div className="col-1" onClick={handleAddLink} style={{ cursor: 'pointer', fontSize: '20px' }}>
              <FaPlusCircle style={{ color: 'green' }} />
            </div>

            {/* Remove link icon */}
            {index > 0 && (
              <div
                className="col-1"
                onClick={() => handleRemoveLink(index)}
                style={{ cursor: 'pointer', fontSize: '20px' }}
              >
                <FaTimesCircle style={{ color: 'red' }} />
              </div>
            )}
          </div>
        ))}
        <div className="form-actions">
          <button type="submit" className="save-btn">
            Save
          </button>
          <button type="reset" className="cancel-btn">
            Cancel
          </button>
        </div>
      </form>
    </div>
  </div>
);
}
