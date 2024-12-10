import React, { useEffect, useState } from "react";
import "./Announcements.css";
import { apiCall, getTokenFromLocalStorage } from "../utils/apiCall";
import ConnectMe from "../config/connect";
import showToast from "../utils/toastHelper";
import { FaPlusCircle, FaTimesCircle } from 'react-icons/fa';
export default function Announcements() {
  const [selectedImages, setSelectedImages] = useState([]); // Initializing the state for selected images
  const [existingAnnouncements, setExistingAnnouncements] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasMore, setHasMore] = useState(true);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    location: "",
    description: "",
    images: [],
    fullName: "",
    Designation: "",
    name: 'announcement',
    links: [{ linkTitle: '', link: '' }],
    AnnouncementDate: ''
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
    let imageId = null;

    // Check if formData.images is provided and not empty
    if (formData.images && formData.images.length > 0) {
      // Call the uploadImageAnnouncement function only if images are provided
      imageId = await uploadImageAnnouncement();
    }

    const dataToSave = {
      fullName: formData.fullName,
      title: formData.title,
      location: formData.location,
      description: formData.description,
      Designation: formData.Designation,
      name: formData.name,
      links: formData.links,
      AnnouncementDate: formData.AnnouncementDate,
      // If imageId is populated, use it; otherwise, it will be null (or you can handle it accordingly)
      images: imageId?.data?.idForUnderverslaUpload[0] || null
    };


    const token = getTokenFromLocalStorage();
    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };

    const url = `${ConnectMe.BASE_URL}/announcements/create`;
    const result = await apiCall('POST', url, headers, JSON.stringify(dataToSave));

    if (result.success) {
      showToast('Uploaded Successfully', 'success')
      setFormData({
        title: "",
        location: "",
        description: "",
        images: [],
        fullName: "",
        Designation: "",
        name: 'announcement',
        links: [{ linkTitle: '', link: '' }],
        AnnouncementDate: ''
      });
      setSelectedImages([])
    } else {
      console.error('Error saving announcement:', result.message);
    }
  };


  const uploadImageAnnouncement = async () => {
    if (!selectedAnnouncement.images || selectedAnnouncement.images.length === 0) {
      showToast('Please select at least one image.', 'error');
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
          const file = new File([blob], 'banners.png', { type: blob.type });

          formData.append('files', file);
        } else {
          formData.append('files', image);
        }
      }

      formData.append('name', 'Announcements');

      const headers = {
        'Authorization': `Bearer ${token}`,
      };

      const response = await apiCall('POST', url, headers, formData);
      if (response.success) {
        showToast('Banner uploaded successfully!', 'success')
        console.log(response)
        return response
      } else {
        showToast("Failed to upload banner", 'error')
      }
    } catch (error) {
      console.error('Error uploading banner:', error.message);
      showToast(`Error uploading banner: ${error.message || 'An unexpected error occurred'}`, 'error');
    }
  };

  const handleAddLink = (name = null) => {

    if (name == 'linkUpdate') {
      const lastLink =
        selectedAnnouncement.links[selectedAnnouncement.links.length - 1];

      // Ensure the last link is completely filled
      if (!lastLink.linkTitle || !lastLink.link) {
        alert("Please fill in both the Link Title and Link before adding a new one.");
        return;
      }

      // Add a new link object to the links array
      setSelectedAnnouncement((prevAnnouncement) => ({
        ...prevAnnouncement,
        links: [...prevAnnouncement.links, { linkTitle: "", link: "" }],
      }));
    } else {
      const lastLink = formData.links[formData.links.length - 1];
      if (!lastLink.linkTitle || !lastLink.link) {
        alert('Please fill in both the Link Title and Link before adding a new one.');
        return;
      }

      setFormData({
        ...formData,
        links: [...formData.links, { linkTitle: '', link: '' }], // Add new empty link pair
      });
    }


  };

  // Remove a specific link field set
  const handleRemoveLink = (index, name = null) => {
    if (name == 'linkUpdate') {
      const newLinks = selectedAnnouncement.links.filter((_, i) => i !== index);
      setSelectedAnnouncement({ ...selectedAnnouncement, links: newLinks });
    }
    else {
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







  const fetchExistingAnnouncements = async (page = 1, limit = 3) => {
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
        if (response.data.announcements.length > 0) {
          setExistingAnnouncements(response.data.announcements);

        } else {
          setHasMore(false); // No more data to load
        }
      } else {
        setError("Failed to fetch announcements.");
      }
    } catch (err) {
      setError("Error fetching announcements.");
    } finally {
      setLoading(false); // Hide loader after fetching
    }
  };

  // Load more announcements on scroll
  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop + 1 >=
      document.documentElement.scrollHeight &&
      !loading &&
      hasMore
    ) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  useEffect(() => {
    fetchExistingAnnouncements(page);
  }, [page]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading, hasMore]);


  const handleUpdateClick = (announcement) => {
    // Toggle visibility of the form
    if (selectedAnnouncement?._id === announcement._id) {
      setSelectedAnnouncement(null); // Hide form if the same announcement is clicked
    } else {
      setSelectedAnnouncement(announcement); // Show form for the new announcement
    }
  };


  const handleInputChange = (e, index = null, fieldName = null) => {
    const { name, value } = e.target;
    if (index !== null && fieldName) {
      // Update specific link in the links array
      setSelectedAnnouncement((prevAnnouncement) => {
        const updatedLinks = [...prevAnnouncement.links]; // Create a shallow copy of the links array
        updatedLinks[index] = {
          ...updatedLinks[index],
          [fieldName]: value, // Update the specific field in the link object
        };

        return {
          ...prevAnnouncement,
          links: updatedLinks, // Replace links with the updated array
        };
      });
    } else {
      // Update other fields in selectedAnnouncement
      setSelectedAnnouncement((prevAnnouncement) => ({
        ...prevAnnouncement,
        [name]: value,
      }));
    }

    console.log(selectedAnnouncement)
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
  
    try {
      let imageId = null;
  
      // Check if images are provided in the selectedAnnouncement object
      if (selectedAnnouncement.images && selectedAnnouncement.images.length > 0) {
        // Upload images and get the image ID
        const uploadResponse = await uploadImageAnnouncement();
        imageId = uploadResponse?.data?.idForUnderverslaUpload[0] || null;
      }
  
      // Prepare the data to update
      const dataToUpdate = {
        updates: {
          fullName: selectedAnnouncement.fullName,
          title: selectedAnnouncement.title,
          location: selectedAnnouncement.location,
          description: selectedAnnouncement.description,
          Designation: selectedAnnouncement.Designation,
          name: selectedAnnouncement.name,
          links: selectedAnnouncement.links?.filter(
            (link) => link.linkTitle && link.link // Ensure valid links only
          ),
          AnnouncementDate: selectedAnnouncement.AnnouncementDate,
          images: imageId || selectedAnnouncement.images, // Use uploaded image ID or retain existing images
        },
      };
      
  
      // Retrieve token from local storage
      const token = getTokenFromLocalStorage();
  
      // Prepare request headers
      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      };
  
      // Define the API endpoint
      const url = `${ConnectMe.BASE_URL}/announcements/${selectedAnnouncement._id}`;
  
      // Make the API call using PUT method
      const result = await apiCall('PUT', url, headers, JSON.stringify(dataToUpdate));
  
      // Handle API response
      if (result.success) {
        showToast('Updated Successfully', 'success');
        setSelectedAnnouncement(null); // Reset the selected announcement
        setSelectedImages([]); // Clear selected images
      } else {
        console.error('Error updating announcement:', result.message);
        showToast(result.message || 'Failed to update announcement', 'error');
      }
    } catch (error) {
      console.error('An error occurred while updating the announcement:', error);
      showToast('An unexpected error occurred. Please try again.', 'error');
    }
  };
  




  const deleteAnnouncemnt = async (data) => {
    const { _id } = data
    const token = getTokenFromLocalStorage();
    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };

    const url = `${ConnectMe.BASE_URL}/announcements/${_id}`;
    const result = await apiCall('DELETE', url, headers);
    if (result.success) {

      showToast('Deleted Successfully', 'success')
      fetchExistingAnnouncements()
      setSelectedImages([])
    } else {
      console.error('Error saving announcement:', result.message);
    }
  }


  return (
    <div className="admin-announcements">
      <div className="container mt-4">
        <h2> Current Announcements</h2>
        <div className="old-announcements border p-3" style={{ height: "200px", overflowY: "scroll" }}>
          <h4>Old Announcements</h4>
          <ul className="list-group">
            {existingAnnouncements.map((announcement) => (
              <li
                className="list-group-item"
                key={announcement._id}
                style={{ cursor: "pointer" }}
              >
                {announcement.title}
                <div className="mt-2">
                  <button
                    className="btn btn-primary btn-sm me-2"
                    onClick={() => handleUpdateClick(announcement)}
                  >
                    Update
                  </button>
                  <button className="btn btn-danger btn-sm me-2" onClick={() => deleteAnnouncemnt(announcement)}>Delete</button>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {selectedAnnouncement && (
          <div className="mt-4">
            <div
              className="d-flex justify-content-between align-items-center" // Flexbox layout
              style={{ fontSize: '20px' }}
            >
              <span>Edit Announcement</span>
              <div
                onClick={() => setSelectedAnnouncement(null)}
                style={{ cursor: 'pointer' }}
              >
                <FaTimesCircle style={{ color: 'red' }} />
              </div>
            </div>
            <form onSubmit={handleUpdateSubmit}>
              <div className="mb-3">
                <label htmlFor="title" className="form-label">Title</label>
                <input
                  type="text"
                  className="form-control"
                  id="title"
                  name="title"
                  value={selectedAnnouncement.title}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="manager" className="form-label">Your Full Name</label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  className="form-control"
                  required
                  value={selectedAnnouncement.fullName}
                  onChange={handleInputChange}
                />
              </div>

              <div className="mb-3">

                <label htmlFor="manager" className="form-label">Your Designation</label>
                <input
                  type="text"
                  className="form-control"
                  id="Designation"
                  name="Designation"
                  value={selectedAnnouncement.Designation}
                  onChange={handleInputChange}
                />
              </div>


              <div className="mb-3">
                <label htmlFor="description" className="form-label">Description</label>
                <textarea
                  className="form-control"
                  id="description"
                  name="description"
                  rows="4"
                  value={selectedAnnouncement.description}
                  onChange={handleInputChange}
                  required
                ></textarea>
              </div>
              <div className="mb-3">
                <label htmlFor="location" className="form-label">Location</label>
                <input
                  type="text"
                  className="form-control"
                  id="location"
                  name="location"
                  value={selectedAnnouncement.location}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="AnnouncementDate" className="form-label">Announcement Date</label>
                <input
                  type="date"
                  className="form-control"
                  id="AnnouncementDate"
                  name="AnnouncementDate"
                  value={selectedAnnouncement.AnnouncementDate.substring(0, 10)} // Only the date part
                  onChange={handleInputChange}
                />
              </div>



              {selectedAnnouncement?.links?.map((link, index) => (
                <div className="form-group d-flex" key={index}>
                  <div className="col-2">
                    <label htmlFor={`link-title-${index}`}>Link Title</label>
                    <input
                      id={`link-title-${index}`}
                      name="linkTitle"
                      value={link.linkTitle}
                      onChange={(e) => handleInputChange(e, index, "linkTitle")} // Pass index and fieldName
                    />
                  </div>

                  <div className="col-8">
                    <label htmlFor={`Links-${index}`}>Links</label>
                    <input
                      id={`Links-${index}`}
                      name="link"
                      value={link.link}
                      onChange={(e) => handleInputChange(e, index, "link")} // Pass index and fieldName
                    />
                  </div>


                  {/* Add link icon */}
                  < div className="col-1" onClick={() => handleAddLink("linkUpdate")} style={{ cursor: 'pointer', fontSize: '20px' }}>
                    <FaPlusCircle style={{ color: 'green' }} />
                  </div>

                  {/* Remove link icon */}
                  {index > 0 && (
                    <div
                      className="col-1"
                      onClick={() => handleRemoveLink(index, 'linkUpdate')}
                      style={{ cursor: 'pointer', fontSize: '20px' }}
                    >
                      <FaTimesCircle style={{ color: 'red' }} />
                    </div>
                  )}
                </div>
              ))}


              <div className="form-group">
                {selectedImages.length == 0 &&
                  <div>
                    <label htmlFor="profile-image">Profile Image  **Only ONE</label>
                    <img
                      src={`${ConnectMe.img_URL}${selectedAnnouncement.imagePath}`} // Display the existing image first
                      alt="Existing Banner"
                      className="banner-image"
                    />
                  </div>}

                {/* <div
                  className="delete-icon"
                  onClick={handleInputChange} // Remove the existing image
                  style={{ cursor: 'pointer' }}
                >
                  <FaTimesCircle style={{ color: 'red', fontSize: '24px' }} />
                </div> */}

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
              <button type="submit" className="btn btn-success">Save Changes</button>
            </form>
          </div >
        )
        }
      </div >

      <hr></hr>
      {/* New Announcements Section */}


      {
        selectedAnnouncement == null &&
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
                required
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
                required
                value={formData.Designation}
                onChange={handleChange}
                placeholder="Assistant Manager - Accounts"
              />
            </div>

            <div className="form-group">
              <label htmlFor="date">Announcement Date</label>
              <input type="date" id="AnnouncementDate" value={formData.AnnouncementDate}
                onChange={handleChange}
                required
                placeholder="29 Nov 2024" />
            </div>

            <div className="form-group">
              <label htmlFor="location">For Which Location Announcement is for?</label>
              <input
                type="text"
                id="location"
                required
                value={formData.location}
                onChange={handleChange}
                placeholder="Chhatrapati Sambhajinagar (Maharashtra)"
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                value={formData.description}
                required
                onChange={handleChange}
                placeholder="Enter description"
              ></textarea>
            </div>

            <div className="form-group">
              <label htmlFor="profile-image">Profile Image  **Only ONE</label>
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


            {formData?.links?.map((link, index) => (
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
      }
    </div >
  );
}
