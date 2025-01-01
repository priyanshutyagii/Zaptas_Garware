import React, { useState, useEffect } from "react";
import { Form, Button, Row, Col, Spinner } from "react-bootstrap";
import { apiCall, getTokenFromLocalStorage } from "../../utils/apiCall";
import ConnectMe from "../../config/connect";

const ITServiceRequestForm = () => {
  const [formData, setFormData] = useState({
    requestId: "REQ-" + Date.now(),
    requestDate: new Date().toISOString().split("T")[0],
    requesterName: "John Doe",
    requesterDept: "IT Department",
    requesterDesignation: "Manager",
    requesterLocation: "New York",
    typeOfService: "",
    fieldsData: {}, // Dynamically populated fields based on service type
  });

  const [serviceTypes, setServiceTypes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch service types on component mount
  useEffect(() => {
    const fetchServiceTypes = async () => {
      setIsLoading(true);
      try {
        const url = `${ConnectMe.BASE_URL}/it/api/service-types`;
        const token = getTokenFromLocalStorage();
        const headers = { Authorization: `Bearer ${token}` };
        const response = await apiCall("GET", url, headers);

        if (response && response.data) {
          setServiceTypes(response.data); // Populate the service types dynamically
        } else {
          console.error("Failed to fetch service types");
        }
      } catch (error) {
        console.error("Error fetching service types:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchServiceTypes();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      fieldsData: {
        ...prevData.fieldsData,
        [name]: value,
      },
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data Submitted: ", formData);
  };

  return (
    <div className="container mt-5">
      <h3 className="mb-4 text-center">IT Service Request Form</h3>

      <Form onSubmit={handleSubmit}>
        {/* Requester Details Section */}
        <div className="mb-4">
          <h4 className="text-primary mb-3">Requester Details</h4>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Request ID</Form.Label>
                <Form.Control type="text" value={formData.requestId} readOnly />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Request Date</Form.Label>
                <Form.Control type="date" value={formData.requestDate} readOnly />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Requester Name</Form.Label>
                <Form.Control type="text" value={formData.requesterName} readOnly />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Requester Dept</Form.Label>
                <Form.Control type="text" value={formData.requesterDept} readOnly />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Requester Designation</Form.Label>
                <Form.Control type="text" value={formData.requesterDesignation} readOnly />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Requester Location</Form.Label>
                <Form.Control type="text" value={formData.requesterLocation} readOnly />
              </Form.Group>
            </Col>
          </Row>
        </div>

        {/* Service Request Details Section */}
        <div className="mb-4">
          <h4 className="text-primary mb-3">Service Request Details</h4>
          <Row>
            <Col md={12}>
              <Form.Group className="mb-3">
                <Form.Label>Type of Service</Form.Label>
                <Form.Control
                  as="select"
                  name="typeOfService"
                  value={formData.typeOfService}
                  onChange={handleInputChange}
                  disabled={isLoading}
                >
                  <option value="" disabled>
                    {isLoading ? "Loading..." : "Select a service"}
                  </option>
                  {serviceTypes.map((type, index) => (
                    <option key={index} value={type.name}>
                      {type.name}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
            </Col>
          </Row>
        </div>

        {/* Dynamically Render Service Fields */}
        {serviceTypes
          .filter((type) => type.name === formData.typeOfService)
          .map((type, index) => (
            <div key={index}>
              {type.fields.map((field, fieldIndex) => (
                <Row key={fieldIndex} className="mb-3">
                  <Col md={12}>
                    <Form.Group className="mb-3">
                      <Form.Label>{field.fieldName}</Form.Label>
                      {field.fieldType === "Boolean" ? (
                        <Form.Check
                          type="checkbox"
                          name={field.fieldName}
                          checked={formData.fieldsData[field.fieldName] || false}
                          onChange={(e) => handleFieldChange(e)}
                        />
                      ) : (
                        <Form.Control
                          type={field.fieldType === "String" || field.fieldType === "text" ? "text" : "date"}
                          name={field.fieldName}
                          value={formData.fieldsData[field.fieldName] || ""}
                          onChange={(e) => handleFieldChange(e)}
                          required={field?.isRequired}
                        />
                      )}
                    </Form.Group>
                  </Col>
                </Row>
              ))}
            </div>
          ))}

        {/* Submit Button */}
        <div className="text-center mt-4">
          <Button variant="primary" type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Spinner animation="border" size="sm" />
                <span className="ml-2">Submitting...</span>
              </>
            ) : (
              "Submit Request"
            )}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default ITServiceRequestForm;
