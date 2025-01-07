import React, { useState, useEffect } from 'react';
import ConnectMe from '../config/connect';
import { apiCall } from '../utils/apiCall';
import './ServiceTypePage.css'; // Import the custom CSS file

const ServiceTypePage = () => {
  const [serviceTypes, setServiceTypes] = useState([]);
  const [newServiceType, setNewServiceType] = useState({ name: '', description: '', fields: [] });
  const [newField, setNewField] = useState({ fieldName: '', fieldType: '', isRequired: false });
  const [submittedFields, setSubmittedFields] = useState([]);

  const getTokenFromLocalStorage = () => {
    return localStorage.getItem('authToken');
  };

  useEffect(() => {
    const fetchServiceTypes = async () => {
      const token = getTokenFromLocalStorage();
      const headers = { Authorization: `Bearer ${token}` };
      const response = await apiCall('GET', `${ConnectMe.BASE_URL}/it/api/service-types?show=fields`, headers);
      if (response && response.data) {
        setServiceTypes(response.data);
      } else {
        console.error("Failed to fetch service types");
      }
    };
    fetchServiceTypes();
  }, []);

  const handleAddServiceType = async () => {
    // Validate if Service Type Name is entered
    if (!newServiceType.name) {
      alert("Please enter a service type name.");
      return;
    }

    const token = getTokenFromLocalStorage();
    const headers = { Authorization: `Bearer ${token}` };
    const response = await apiCall('POST', `${ConnectMe.BASE_URL}/it/api/service-type`, headers, newServiceType);

    if (response?.status) {
      setServiceTypes([...serviceTypes, response.data]);
      setNewServiceType({ name: '', description: '', fields: [] }); // Clear after submission
    }
  };

  const handleAddField = () => {
    if (!newField.fieldName || !newField.fieldType) {
      alert("Please provide both field name and field type.");
      return;
    }

    setNewServiceType({
      ...newServiceType,
      fields: [...newServiceType.fields, newField],
    });

    // Clear the new field form after adding
    setNewField({ fieldName: '', fieldType: '', isRequired: false });
  };

  // Delete a service type
  const handleDeleteServiceType = async (serviceId) => {
    const token = getTokenFromLocalStorage();
    const headers = { Authorization: `Bearer ${token}` };
    const response = await apiCall('DELETE', `${ConnectMe.BASE_URL}/it/api/service-type/${serviceId}`, headers);
    
    if (response?.status) {
      setServiceTypes(serviceTypes.filter(service => service._id !== serviceId));
    }
  };

  // Delete a field from a service type
  const handleDeleteField = (fieldIndex) => {
    setNewServiceType({
      ...newServiceType,
      fields: newServiceType.fields.filter((_, index) => index !== fieldIndex),
    });
  };

  return (
    <div className="service-type-page">
      <h1>Service Types</h1>
      <div className='row'>
        {/* Add Service Type Form */}
        <div className='col-md-8'>
          <div className="form-section">
            <h2>Add Service Type</h2>
            <div className="form-group">
              <label htmlFor="serviceTypeName">Service Type Name:</label>
              <input
                id="serviceTypeName"
                type="text"
                placeholder="Service Type Name"
                value={newServiceType.name}
                onChange={(e) => setNewServiceType({ ...newServiceType, name: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="serviceTypeDescription">Service Type Description:</label>
              <input
                id="serviceTypeDescription"
                type="text"
                placeholder="Service Type Description"
                value={newServiceType.description}
                onChange={(e) => setNewServiceType({ ...newServiceType, description: e.target.value })}
              />
            </div>
          </div>

          {/* Add Field Form */}
          <div className="form-section">
            <h2>Add Field</h2>
            <div className="form-group">
              <label htmlFor="fieldName">Field Name:</label>
              <input
                id="fieldName"
                type="text"
                placeholder="Field Name"
                value={newField.fieldName}
                onChange={(e) => setNewField({ ...newField, fieldName: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="fieldType">Field Type:</label>
              <select
                id="fieldType"
                value={newField.fieldType}
                onChange={(e) => setNewField({ ...newField, fieldType: e.target.value })}
                required
              >
                <option value="">Select Field Type</option>
                <option value="text">Text</option>
                <option value="number">Number</option>
                <option value="email">Email</option>
                <option value="date">Date</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="isRequired">
                <input
                  type="checkbox"
                  id="isRequired"
                  checked={newField.isRequired}
                  onChange={(e) => setNewField({ ...newField, isRequired: e.target.checked })}
                />
                Is Required
              </label>
            </div>
            <button className="btn-primary" onClick={handleAddField}>Add Field</button>
          </div>
        </div>

        {/* Service Type and Fields Display */}
        <div className='col-md-4'>
          <div className="form-section">
            <h2>Service Type & Fields</h2>
            <div className="form-group">
              <label>Service Type Name: {newServiceType.name}</label>
            </div>
            <div className="form-group">
              <label>Description: {newServiceType.description}</label>
            </div>
            <h3>Fields:</h3>
            <ul>
              {newServiceType.fields.map((field, index) => (
                <li key={index}>
                  {field.fieldName} ({field.fieldType}) {field.isRequired ? "(Required)" : ""}
                  <button onClick={() => handleDeleteField(index)} className="btn-delete">Delete</button>
                </li>
              ))}
            </ul>
            <button className="btn-primary" onClick={handleAddServiceType}>
              Submit Service Type with Fields
            </button>
          </div>
        </div>
      </div>

      {/* Display Existing Service Types */}
      <div className="service-list">
        <h2>Existing Service Types</h2>
        {serviceTypes.map(service => (
          <div className="service-card" key={service._id}>
            <h3>{service.name}</h3>
            <p>{service.description}</p>
            <h4>Fields</h4>
            <ul>
              {service.fields.map((field, index) => (
                <li key={index}>
                  {field.fieldName} ({field.fieldType}) {field.isRequired ? "(Required)" : ""}
                </li>
              ))}
            </ul>
            <button className="btn-delete" onClick={() => handleDeleteServiceType(service._id)}>
              Delete Service Type
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServiceTypePage;
