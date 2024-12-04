import React, { useState, useEffect } from "react";
import "./Announcements.css";
import { FaPlusCircle, FaTimesCircle } from 'react-icons/fa';
import { apiCall, getTokenFromLocalStorage } from "../utils/apiCall";
import ConnectMe from "../config/connect";

export default function Quicklinks() {
  const [formData, setFormData] = useState({
    links: [{ title: '', link: '', id: '' }],
  });


  // Fetch quick links when the component mounts
  useEffect(() => {
    fetchQuickLinks();
  }, []);

  const fetchQuickLinks = async () => {
    try {
      const token = getTokenFromLocalStorage();
      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      };

      const response = await apiCall('GET', `${ConnectMe.BASE_URL}/qlink/quick-links`, headers);
      if (response.success) {
        const fetchedLinks = response?.data?.map((link) => ({
          id: link._id,  // Make sure to store the ID for each link
          title: link.title,
          link: link.url,
        }));
        setFormData({ links: fetchedLinks });
      } else {
        console.error('Error fetching quick links.');
      }
    } catch (error) {
      console.error('Error fetching quick links:', error);
      alert('Error fetching quick links');
    }
  };

  const handleAddLink = () => {
    const lastLink = formData.links[formData.links.length - 1];
    if (!lastLink.title || !lastLink.link) {
      alert('Please fill in both the Link Title and Link before adding a new one.');
      return;
    }

    setFormData({
      ...formData,
      links: [...formData.links, { title: '', link: '', id: '' }],
    });
  };

  const handleRemoveLink = async (index) => {
    const linkToDelete = formData.links[index];

    // Confirm the deletion
    const confirmDelete = window.confirm('Are you sure you want to delete this link?');
    console.log(confirmDelete, linkToDelete, 'ddddddddddd')
    if (confirmDelete && linkToDelete.id) {
      try {
        const token = getTokenFromLocalStorage();
        const headers = {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        };

        const response = await apiCall('DELETE', `${ConnectMe.BASE_URL}/qlink/quick-links/${linkToDelete.id}`, headers);
        if (response.success) {
          // After deleting, remove it from the state
          const newLinks = formData.links.filter((_, i) => i !== index);
          setFormData({ ...formData, links: newLinks });
        } else {
          console.error('Error deleting link:', response.message);
          alert('Error deleting link');
        }
      } catch (error) {
        console.error('Error deleting link:', error);
        alert('Error deleting link');
      }
    }
  };

  const handleAddLinkchange = (index, e) => {
    const { name, value } = e.target;
    const newLinks = [...formData.links];
    newLinks[index][name] = value;
    setFormData({ ...formData, links: newLinks });
  };

  const handleSaveLinks = async () => {
    const { links } = formData;

    // Find the link object with an empty id
    const linkToUpdate = links.find(link => link.id === "");

    // If no link with an empty id exists, alert the user
    if (!linkToUpdate) {
      alert('No new link to save.');
      return;
    }

    // Validate that the link has both title and URL
    if (!linkToUpdate.title || !linkToUpdate.link) {
      alert('Please fill in both the Link Title and Link before saving.');
      return;
    }

    // Proceed with the update for this specific link
    try {
      const token = getTokenFromLocalStorage();
      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      };

  

      const dataTosend ={
        links:[{
          title: linkToUpdate.title,
          link: linkToUpdate.link,
        }]
      }

      // Send API request to update the specific link (you can use PUT for the update)
      const response = await apiCall('POST', `${ConnectMe.BASE_URL}/qlink/quick-links`, headers,dataTosend);

      if (response.success) {
        alert('Link updated successfully!');
        // After updating, you can update the state with the new data if needed
        setFormData({
          ...formData,
          links: links.map(link =>
            link.id === linkToUpdate.id
              ? { ...link, title: linkToUpdate.title, link: linkToUpdate.link }
              : link
          ),
        });
      } else {
        console.error('Error updating link:', response.message);
        alert('Error updating link');
      }
    } catch (error) {
      console.error('Error saving link:', error);
      alert('Error saving link');
    }
  };


  return (
    <div>
      {formData?.links?.map((link, index) => (
        <div className="form-group d-flex" key={index}>
          <div className="col-2">
            <label htmlFor={`link-title-${index}`}>Link Title</label>
            <input
              id={`link-title-${index}`}
              name="title"
              value={link.title}
              onChange={(e) => handleAddLinkchange(index, e)}
            />
          </div>

          <div className="col-8">
            <label htmlFor={`Links-${index}`}>Links</label>
            <input
              id={`Links-${index}`}
              name="link"
              value={link.link}
              onChange={(e) => handleAddLinkchange(index, e)}
            />
          </div>

          {/* Add link icon */}
          <div className="col-1" onClick={handleAddLink} style={{ cursor: 'pointer', fontSize: '20px' }}>
            <FaPlusCircle style={{ color: 'green' }} />
          </div>

          {/* Remove link icon */}
          {(
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

      {/* Save button */}
      <button
        className="btn btn-primary"
        onClick={handleSaveLinks}
        style={{ marginTop: '20px' }}
      >
        Save Links
      </button>
    </div>
  );
}
