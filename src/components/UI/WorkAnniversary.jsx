import React, { useEffect, useState } from "react";
import "./BirthdayBox.css";
import { FaBirthdayCake, FaMapMarkerAlt } from "react-icons/fa";
import { apiCall } from "../../utils/apiCall";
import ConnectMe from "../../config/connect";

export default function WorkAnniversary() {
  const [workAnniversaries, setWorkAnniversaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchWorkAnniversaries = async () => {
    try {
      setLoading(true); // Show loader while fetching
      const url = `${ConnectMe.BASE_URL}/hrms/work-anniversary`; // Replace with actual URL
      const token = localStorage.getItem("authToken"); // Assuming the token is stored in localStorage
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      const response = await apiCall("GET", url, headers);
      if (response.success) {
        setWorkAnniversaries(response?.data?.workAnniversaries);
      } else {
        setError("Failed to fetch work anniversaries.");
      }
    } catch (err) {
      setError("Error fetching work anniversaries.");
    } finally {
      setLoading(false); // Hide loader after fetching
    }
  };

  useEffect(() => {
    fetchWorkAnniversaries();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="row">
      <div className="col-md-3">
        <div className="card text-center wish">
          <div className="card-header">
            <FaBirthdayCake /> &nbsp;Work Anniversary
          </div>
          <div className="card-body d-flex align-items-center justify-content-center">
            <button className="btn btn-primary cartbtn">
              Work Anniversary
            </button>
          </div>
        </div>
      </div>
      {workAnniversaries.slice(0, 3).map((anniversary, index) => (
        <div className="col-md-3" key={index}>
          <div className="wish-card">
            <div className="user-image">
              <img src="./user.png" alt="User" className="rounded-circle" />
            </div>
            <div className="wish-content">
              <h5 className="title">
                {`${anniversary.FirstName} ${anniversary.MiddleName} ${anniversary.LastName}`}
              </h5>
              <p className="message">{`Employee Code: ${anniversary.EmployeeCode}`}</p>
              <div className="info">
                <span className="location">
                  <FaMapMarkerAlt className="icon" /> Chaubepur, Kanpur
                </span>
                <span className="date">
                  <FaBirthdayCake className="icon" />{" "}
                  {new Date(anniversary.JoinDate).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>
              <button className="send-wish-btn">Send Wish</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
