import React, { useState } from 'react';
import { Button, Form, Container, Row, Col, Image } from 'react-bootstrap';
import { FaCamera, FaTrash } from 'react-icons/fa';
import showToast from '../../utils/toastHelper';
import ConnectMe from '../../config/connect';
import { apiCall, getTokenFromLocalStorage } from '../../utils/apiCall';

const UserProfile = () => {
    const [selectedImages, setSelectedImages] = useState([]); // Array for selected images
    const [userDetails, setUserDetails] = useState({
        name: 'John Doe',
        email: 'john.doe@example.com',
        profilePicture: 'https://placehold.co/150', // Default profile picture
    });
    const [updatedPhoto, setUpdatedPhoto] = useState(null);

    // Handle profile picture update
    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Create a temporary URL for the selected image
            const imageUrl = URL.createObjectURL(file);
            setUpdatedPhoto(imageUrl); // Temporarily display the new photo
            setSelectedImages([file]); // Store the selected file in the array (as only one image can be selected)
        }
    };

    const handleRemovePhoto = () => {
        setUpdatedPhoto(null); // Clear the temporary photo
        setSelectedImages([]); // Clear the selected images array
        setUserDetails({ ...userDetails, profilePicture: 'https://placehold.co/150' }); // Reset to default profile picture
    };

    const handleSubmit = async () => {
        try {
          // Ensure a photo is updated
          if (updatedPhoto) {
            setUserDetails({
              ...userDetails,
              profilePicture: updatedPhoto,
            });
          }
      
          alert('Profile updated successfully!');
      
          // Upload the image and get the image ID
          const uploadResponse = await uploadImageAnnouncement();
          const imageId = uploadResponse?.data?.idForUnderverslaUpload;
      
          // Check if imageId is retrieved successfully
          if (!imageId) {
            alert('Failed to upload the image. Please try again.');
            return;
          }
      
          // Define the API URL and headers
          const url = `${ConnectMe.BASE_URL}/hrms/update-images`; // Replace with actual backend URL
          const token = getTokenFromLocalStorage();
          const headers = {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          };
      
          // Prepare the request body
          const requestBody = {
            imageId: imageId[0], // Pass the uploaded image ID
          };
      
          // Make the API call
          const response = await apiCall('PUT', url, headers, JSON.stringify(requestBody));
      
          // Handle the response
          if (response.success) {
            alert('User profile image updated successfully!');
          
          } else {
            showToast(response.message, 'error');
          }
        } catch (err) {
          console.error('Error updating user image:', err);
        }
      };
      

    const uploadImageAnnouncement = async () => {
        if (selectedImages.length === 0) {
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
    
          formData.append('name', 'ProfilePhoto');
    
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

    return (
        <Container className="mt-5">
            <Row className="justify-content-center">
                <Col md={6} sm={12}>
                    <div className="text-center">
                        {/* Display Profile Photo */}
                        <Image
                            src={updatedPhoto || userDetails.profilePicture} // Use updated photo if available, otherwise fallback to default
                            roundedCircle
                            width="150"
                            height="150"
                            alt="User Profile"
                        />
                        <div className="mt-2">
                            {/* File Input for Photo */}
                            <label htmlFor="file-upload" className="btn btn-primary">
                                <FaCamera size={20} /> Update Photo
                            </label>
                            <input
                                id="file-upload"
                                type="file"
                                accept="image/*"
                                style={{ display: 'none' }}
                                onChange={handlePhotoChange}
                            />
                            {/* Remove Photo Button */}
                            {updatedPhoto && (
                                <Button variant="danger" className="mt-2" onClick={handleRemovePhoto}>
                                    <FaTrash size={16} /> Remove Photo
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* User Information Form */}
                    <Form className="mt-4" onSubmit={(e) => e.preventDefault()}>
                        <Form.Group controlId="formName">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type="text"
                                value={userDetails.name}
                                onChange={(e) =>
                                    setUserDetails({ ...userDetails, name: e.target.value })
                                }
                            />
                        </Form.Group>

                        <Form.Group controlId="formEmail" className="mt-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                value={userDetails.email}
                                onChange={(e) =>
                                    setUserDetails({ ...userDetails, email: e.target.value })
                                }
                            />
                        </Form.Group>

                        <Button variant="success" type="button" className="mt-4" onClick={handleSubmit}>
                            Update Profile
                        </Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
};

export default UserProfile;
