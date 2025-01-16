import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { apiCall, getTokenFromLocalStorage } from '../utils/apiCall';
import ConnectMe from '../config/connect';

const ServiceRequestPage = () => {
  const [serviceRequests, setServiceRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState('');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [activeTab, setActiveTab] = useState('Pending'); // Active tab state
  const [sortConfig, setSortConfig] = useState({ key: 'requestId', direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1); // Pagination state
  const [itemsPerPage] = useState(10); // Items per page for pagination
  const [searchTerm, setSearchTerm] = useState(''); // Search term

  // Fetch service requests on component load
  useEffect(() => {
    const fetchServiceRequests = async () => {
      setLoading(true);
      try {
        const url = `${ConnectMe.BASE_URL}/it/api/getrequests?status=${activeTab}&count=true&data=true`;
        const token = getTokenFromLocalStorage();
        const headers = { Authorization: `Bearer ${token}` };
        const response = await apiCall('GET', url, headers);

        if (response?.data?.data) {
          setServiceRequests(response.data.data);
          setFilteredRequests(response.data.data);
        } else {
          console.error('Failed to fetch service requests');
        }
      } catch (error) {
        console.error('Error fetching service requests:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchServiceRequests();
  }, [activeTab]);

  // Handle tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  // Handle sorting
  const handleSort = (key) => {
    const direction = sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc';
    setSortConfig({ key, direction });

    const sortedRequests = [...filteredRequests].sort((a, b) => {
      if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
      if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
      return 0;
    });

    setFilteredRequests(sortedRequests);
  };

  // Handle pagination change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Handle search
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    const filteredData = serviceRequests.filter((request) => {
      return (
        request?.requestId?.toLowerCase().includes(event.target.value.toLowerCase()) ||
        request?.EmployeeCode?.toLowerCase().includes(event.target.value.toLowerCase()) ||
        request?.serviceType?.toLowerCase().includes(event.target.value.toLowerCase())
      );
    });
    setFilteredRequests(filteredData);
    setCurrentPage(1); // Reset to first page after search
  };

  // Approve or Reject action
  const handleAction = async (action, requestId) => {
    if (!comment.trim()) {
      alert('Comment is required before taking action.');
      return;
    }

    try {
      const url = `${ConnectMe.BASE_URL}/it/api/servicerequests/${requestId}/${action}`;
      const token = getTokenFromLocalStorage();
      const headers = { Authorization: `Bearer ${token}` };
      const response = await apiCall('PUT', url, headers, { comment });

      if (response && response.data) {
        alert(`Service request ${action}ed successfully!`);
        setServiceRequests((prevState) =>
          prevState.map((request) =>
            request._id === requestId ? { ...request, status: action === 'approve' ? 'Approved' : 'Rejected' } : request
          )
        );
        handleTabChange(activeTab); // Refresh filtered data
      } else {
        alert(`Failed to ${action} the request.`);
      }
    } catch (error) {
      console.error(`Error ${action}ing request:`, error);
      alert(`An error occurred while ${action}ing the request.`);
    }
  };

  // Open comment modal
  const openCommentModal = (requestId) => {
    setSelectedRequest(requestId);
    setComment('');
    const modal = new bootstrap.Modal(document.getElementById('commentModal'));
    modal.show();
  };

  // Pagination logic
  const indexOfLastRequest = currentPage * itemsPerPage;
  const indexOfFirstRequest = indexOfLastRequest - itemsPerPage;
  const currentRequests = filteredRequests.slice(indexOfFirstRequest, indexOfLastRequest);
  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);

  return (
    <div className="container mt-4">
      <h1 className="mb-4 text-center">Service Requests</h1>

      {/* Tabs */}
      <ul className="nav nav-tabs mb-4">
        {['Pending', 'Approved', 'Rejected', 'My Requests'].map((tab) => (
          <li className="nav-item" key={tab}>
            <button
              className={`nav-link ${activeTab === tab ? 'active' : ''}`}
              onClick={() => handleTabChange(tab)}
            >
              {tab}
            </button>
          </li>
        ))}
      </ul>

      {/* Search */}
      <input
        type="text"
        className="form-control mb-3"
        placeholder="Search by Request ID, Employee Code, or Service Type"
        value={searchTerm}
        onChange={handleSearch}
      />

      {/* Table */}
      {loading ? (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead className="table-dark">
              <tr>
                <th onClick={() => handleSort('requestId')}>Request ID</th>
                <th onClick={() => handleSort('EmployeeCode')}>Employee Code</th>
                <th onClick={() => handleSort('serviceType')}>Service Type</th>
                <th>Fields</th>
                <th onClick={() => handleSort('status')}>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentRequests.map((request) => (
                <tr key={request?._id}>
                  <td>{request?.requestId}</td>
                  <td>{request?.EmployeeCode}</td>
                  <td>{request?.serviceType}</td>
                  <td>
                    {request?.serviceFields
                      ?.map((field) => `${field.fieldConfig}: ${field.fieldValue}`)
                      .join(', ')}
                  </td>
                  <td>{request?.status}</td>
                  <td>
                    {/* Conditionally render buttons or remarks based on the activeTab */}
                    {activeTab === 'Pending' ? (
                      <>
                        <button
                          className="btn btn-success btn-sm me-2"
                          onClick={() => openCommentModal(request._id)}
                        >
                          Approve
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => openCommentModal(request._id)}
                        >
                          Reject
                        </button>
                      </>
                    ) : (
                      // When activeTab is not "Pending", show remarks
                      <div className="comment-section">
                        {request?.comments[0]?.comment ? (
                          <>
                            <strong>Remark:</strong> {request?.comments[0]?.comment}
                          </>
                        ) : (
                          <span>No remarks available</span>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      <nav>
        <ul className="pagination justify-content-center">
          <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
            <button className="page-link" onClick={() => handlePageChange(currentPage - 1)}>
              Previous
            </button>
          </li>
          {[...Array(totalPages)].map((_, index) => (
            <li
              className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}
              key={index + 1}
            >
              <button className="page-link" onClick={() => handlePageChange(index + 1)}>
                {index + 1}
              </button>
            </li>
          ))}
          <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
            <button className="page-link" onClick={() => handlePageChange(currentPage + 1)}>
              Next
            </button>
          </li>
        </ul>
      </nav>

      {/* Modal */}
      <div
        className="modal fade"
        id="commentModal"
        tabIndex="-1"
        aria-labelledby="commentModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="commentModalLabel">Add Comment</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <textarea
                className="form-control"
                rows="3"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Enter your comment"
              ></textarea>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => handleAction('approve', selectedRequest)}
              >
                Approve
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={() => handleAction('reject', selectedRequest)}
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceRequestPage;
