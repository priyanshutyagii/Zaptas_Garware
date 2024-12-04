import React, { useState } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";

const ITServiceRequestForm = () => {
  const [formData, setFormData] = useState({
    requestId: "REQ-" + Date.now(), // Auto-generated Request ID
    requestDate: new Date().toISOString().split("T")[0],
    requesterName: "John Doe",
    requesterDept: "IT Department",
    requesterDesignation: "Manager",
    requesterLocation: "New York",
    typeOfService: "Email ID Requirement", // dropdown or text
    periodFrom: "",
    periodTo: "",
    purpose: "",
    emailId: "",
    displayName: "",
    communicationType: "",
    internetAccess: "",
    cameraDetails: "",
    emailIdToBeForward: "",
    emailIdForwardTo: "",
    emailIdForDataRequired: "",
    emailIdDataToBeCopied: "",
    userIdForDataRequired: "",
    userIdDataToBeCopied: "",
    domainUser: "",
    nameOfShareFolder: "",
    accessRightsForShareFolder: "",
    sapUserId: "",
    sapServer: "",
    oldSapUserId: "",
    newSapUserId: "",
    authorizationRequired: "",
    commentFromHoD: "",
    commentFromITHead: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data Submitted: ", formData);
  };

  return (
    <div className="container mt-4">
      <h3 className="mb-4">IT Service Request Form</h3>
      <Form onSubmit={handleSubmit}>
        {/* Requester Details Section */}
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
              <Form.Control
                type="text"
                value={formData.requesterName}
                readOnly
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Requester Dept</Form.Label>
              <Form.Control
                type="text"
                value={formData.requesterDept}
                readOnly
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Requester Designation</Form.Label>
              <Form.Control
                type="text"
                value={formData.requesterDesignation}
                readOnly
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Requester Location</Form.Label>
              <Form.Control
                type="text"
                value={formData.requesterLocation}
                readOnly
              />
            </Form.Group>
          </Col>
        </Row>

        {/* Service Request Details */}
        <h4 className="mb-3">Service Request Details</h4>
        <Row>
          <Col md={12}>
            <Form.Group className="mb-3">
              <Form.Label>Type of Service</Form.Label>
              <Form.Control
                as="select"
                name="typeOfService"
                value={formData.typeOfService}
                onChange={handleInputChange}
              >
                <option>Email ID Requirement</option>
                <option>New User Setup</option>
                <option>Access Rights</option>
              </Form.Control>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Period From</Form.Label>
              <Form.Control
                type="date"
                name="periodFrom"
                value={formData.periodFrom}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Period To</Form.Label>
              <Form.Control
                type="date"
                name="periodTo"
                value={formData.periodTo}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Col>
          <Col md={12}>
            <Form.Group className="mb-3">
              <Form.Label>Purpose</Form.Label>
              <Form.Control
                as="textarea"
                name="purpose"
                value={formData.purpose}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Col>
        </Row>

        {/* Additional Fields */}
        <h4 className="mb-3">Additional Details</h4>
        {[
          { label: "Email ID", name: "emailId" },
          { label: "Display Name", name: "displayName" },
          { label: "Communication Type", name: "communicationType" },
          { label: "Internet Access", name: "internetAccess" },
          // Add more fields here as needed
        ].map((field, index) => (
          <Form.Group className="mb-3" key={index}>
            <Form.Label>{field.label}</Form.Label>
            <Form.Control
              type="text"
              name={field.name}
              value={formData[field.name]}
              onChange={handleInputChange}
            />
          </Form.Group>
        ))}

        {/* Comments */}
        <h4 className="mb-3">Comments</h4>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Comment from HoD</Form.Label>
              <Form.Control
                as="textarea"
                name="commentFromHoD"
                value={formData.commentFromHoD}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Comment from IT Head</Form.Label>
              <Form.Control
                as="textarea"
                name="commentFromITHead"
                value={formData.commentFromITHead}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Col>
        </Row>

        <Button variant="primary" type="submit">
          Submit Request
        </Button>
      </Form>
    </div>
  );
};

export default ITServiceRequestForm;
