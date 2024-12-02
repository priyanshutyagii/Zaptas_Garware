import React, { useEffect, useState } from "react";
import "./BirthdayBox.css";
import { FaBirthdayCake, FaMapMarkerAlt } from "react-icons/fa";
import { apiCall, getTokenFromLocalStorage } from "../../utils/apiCall";
import ConnectMe from "../../config/connect";

export default function NewJoiners() {
  const [newJoiners, setNewJoiners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch new joiners from the API
  useEffect(() => {
    const fetchNewJoiners = async () => {
      const token = getTokenFromLocalStorage();
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };
      setLoading(true);
      const response = await apiCall("GET", `${ConnectMe.BASE_URL}/hrms/joined-today`,headers);

      if (response.success) {
        setNewJoiners(response.data.joinedToday || []);
      } else {
        setError("Failed to fetch new joiners.");
      }
      setLoading(false);
    };

    fetchNewJoiners();
  }, []);

  return (
    <div className="row">
      {/* Card Header */}
      <div className="col-md-3">
        <div className="card text-center wish">
          <div className="card-header">
            <FaBirthdayCake /> &nbsp;New Joiners
          </div>
          <div className="card-body d-flex align-items-center justify-content-center">
            <button className="btn btn-primary cartbtn">New Joiners</button>
          </div>
        </div>
      </div>

      {/* Loading/Error State */}
      {loading && <div>Loading...</div>}
      {error && <div>{error}</div>}

      {/* Display New Joiners */}
      {!loading && !error && newJoiners.length > 0 ? (
        newJoiners.map((joiner, index) => (
          <div className="col-md-3" key={index}>
            <div className="wish-card">
              <div className="user-image">
                <img src="./user.png" alt="User" className="rounded-circle" />
              </div>
              <div className="wish-content">
                <h5 className="title">
                  {joiner.FirstName} {joiner.MiddleName || ""} {joiner.LastName}
                </h5>
                <p className="message">Employee Code: {joiner.EmployeeCode}</p>
                <div className="info">
                  <span className="location">
                    <FaMapMarkerAlt className="icon" /> Chaubepur, Kanpur
                  </span>
                  <span className="date">
                    <FaBirthdayCake className="icon" />{" "}
                    {new Date(joiner.JoinDate).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <button className="send-wish-btn">Send Wish</button>
              </div>
            </div>
          </div>
        ))
      ) : (
        !loading && <div>No new joiners found.</div>
      )}
    </div>
  );
}
