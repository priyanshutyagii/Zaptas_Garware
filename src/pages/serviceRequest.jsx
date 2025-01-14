import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { apiCall, getTokenFromLocalStorage } from '../utils/apiCall';
import ConnectMe from '../config/connect';

const ServiceRequestPage = () => {
  const [serviceRequests, setServiceRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState('');
  const [selectedRequest, setSelectedRequest] = useState(null);

  useEffect(() => {
    const fetchServiceRequests = async () => {
      setLoading(true);
      try {
        const url = `${ConnectMe.BASE_URL}/it/api/getrequests?status=Pending&count=true&data=true`;
        const token = getTokenFromLocalStorage();
        const headers = { Authorization: `Bearer ${token}` };
        const response = await apiCall("GET", url, headers);

        if (response && response.data) {
          setServiceRequests(response?.data?.data);
        } else {
          console.error("Failed to fetch service requests");
        }
      } catch (error) {
        console.error("Error fetching service requests:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchServiceRequests();
  }, []);

  const handleApprove = async (requestId) => {
    if (!comment.trim()) {
      alert('Comment is required before approving.');
      return;
    }

    try {
      const response = await axios.put(`/api/service-requests/${requestId}/approve`, { comment });

      if (response.data.success) {
        alert('Service request approved successfully!');
        setServiceRequests(prevState =>
          prevState.map(request =>
            request._id === requestId ? { ...request, status: 'Approved' } : request
          )
        );
      } else {
        alert('Failed to approve the request.');
      }
    } catch (error) {
      console.error('Error approving request:', error);
      alert('An error occurred while approving the request.');
    }
  };

  const handleReject = async (requestId) => {
    if (!comment.trim()) {
      alert('Comment is required before rejecting.');
      return;
    }

    try {
      const response = await axios.put(`/api/service-requests/${requestId}/reject`, { comment });

      if (response.data.success) {
        alert('Service request rejected successfully!');
        setServiceRequests(prevState =>
          prevState.map(request =>
            request._id === requestId ? { ...request, status: 'Rejected' } : request
          )
        );
      } else {
        alert('Failed to reject the request.');
      }
    } catch (error) {
      console.error('Error rejecting request:', error);
      alert('An error occurred while rejecting the request.');
    }
  };

  return (
    <div className="container mt-4">
      <h1 className="mb-4 text-center">Service Requests for Approval</h1>

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
                <th>Request ID</th>
                <th>Employee Code</th>
                <th>Service Type</th>
                <th>Field Value</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {serviceRequests.map((request) => (
                <tr key={request?._id}>
                  <td>{request?.requestId}</td>
                  <td>{request?.EmployeeCode}</td>
                  <td>{request?.serviceType}</td>
                  <td>
                    {request?.serviceFields
                      ?.map((field) => field?.fieldValue)
                      .join(', ')}
                  </td>
                  <td>{request?.status}</td>
                  <td>
                    {request?.status === 'Pending' && (
                      <>
                        <button
                          className="btn btn-success btn-sm me-2"
                          onClick={() => {
                            setSelectedRequest(request._id);
                            setComment('');
                            document.getElementById('commentModal').style.display = 'block';
                          }}
                        >
                          Approve
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => {
                            setSelectedRequest(request._id);
                            setComment('');
                            document.getElementById('commentModal').style.display = 'block';
                          }}
                        >
                          Reject
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal for adding comment */}
      <div
        id="commentModal"
        className="modal fade"
        tabIndex="-1"
        aria-labelledby="commentModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="commentModalLabel">Add Comment</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <textarea
                className="form-control"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Enter your comment here..."
                rows="4"
              />
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-success"
                onClick={() => {
                  handleApprove(selectedRequest);
                  document.getElementById('commentModal').style.display = 'none';
                }}
              >
                Approve
              </button>
              <button
                className="btn btn-danger"
                onClick={() => {
                  handleReject(selectedRequest);
                  document.getElementById('commentModal').style.display = 'none';
                }}
              >
                Reject
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceRequestPage;
