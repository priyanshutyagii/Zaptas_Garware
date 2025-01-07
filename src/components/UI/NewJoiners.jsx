import React, { useEffect, useState } from "react";
import "./BirthdayBox.css";
import { FaBirthdayCake, FaMapMarkerAlt } from "react-icons/fa";
import { apiCall } from "../../utils/apiCall";
import ConnectMe from "../../config/connect";

export default function NewJoiners() {
  const [workAnniversaries, setWorkAnniversaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    if ((currentIndex + 1) * 3 < workAnniversaries.length) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const fetchWorkAnniversaries = async () => {
    try {
      setLoading(true); // Show loader while fetching
      const url = `${ConnectMe.BASE_URL}/hrms/joined-today`; // Replace with actual URL
      const token = localStorage.getItem("authToken"); // Assuming the token is stored in localStorage
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      const response = await apiCall("GET", url, headers);
      if (response.success && response?.data?.joinedToday?.length > 0) {
        setWorkAnniversaries(response?.data?.joinedToday);
      } else {
        // Set sample data if no data is fetched
        setWorkAnniversaries([
          {
            FirstName: "John",
            MiddleName: "",
            LastName: "Doe",
            CustomField6: "Software Engineer",
            EmployeeCode: "EMP001",
            JoinDate: "2023-12-01",
          },
          {
            FirstName: "Jane",
            MiddleName: "A.",
            LastName: "Smith",
            CustomField6: "HR Manager",
            EmployeeCode: "EMP002",
            JoinDate: "2023-11-25",
          },
          {
            FirstName: "Sam",
            MiddleName: "",
            LastName: "Brown",
            CustomField6: "Marketing Specialist",
            EmployeeCode: "EMP003",
            JoinDate: "2023-11-20",
          },
        ]);
      }
    } catch (err) {
      setError("Error fetching work anniversaries. Showing sample data.");
      // Set sample data in case of error
      setWorkAnniversaries([
        {
          FirstName: "John",
          MiddleName: "",
          LastName: "Doe",
          CustomField6: "Software Engineer",
          EmployeeCode: "EMP001",
          JoinDate: "2023-12-01",
        },
        {
          FirstName: "Jane",
          MiddleName: "A.",
          LastName: "Smith",
          CustomField6: "HR Manager",
          EmployeeCode: "EMP002",
          JoinDate: "2023-11-25",
        },
        {
          FirstName: "Sam",
          MiddleName: "",
          LastName: "Brown",
          CustomField6: "Marketing Specialist",
          EmployeeCode: "EMP003",
          JoinDate: "2023-11-20",
        },
      ]);
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
            <FaBirthdayCake /> &nbsp;New Joiners
          </div>
          <div className="card-body d-flex align-items-center justify-content-center">
            <button className="btn btn-primary cartbtn">New Joiners</button>
          </div>
        </div>
      </div>

      <div
        id="birthdayCarousel"
        className="carousel slide col-md-8"
        data-bs-ride="carousel"
        data-bs-interval="false"
      >
        {/* Carousel Items */}
        <div className="carousel-inner">
          {workAnniversaries.length > 0 ? (
            <>
              <div className="carousel-item active">
                <div className="row">
                  {workAnniversaries
                    .slice(currentIndex * 3, currentIndex * 3 + 3)
                    .map((wish, index) => (
                      <div className="col-md-4" key={index}>
                        <div className="wish-card">
                          <div className="user-image">
                            <img
                              src="./user.png"
                              alt="User"
                              className="rounded-circle"
                            />
                          </div>
                          <div className="wish-content">
                            <h5 className="title">
                              {`${wish.FirstName} ${wish.MiddleName} ${wish.LastName}`}
                            </h5>
                            <p className="message">{wish.CustomField6}</p>
                            <p className="message">{`Employee Code: ${wish.EmployeeCode}`}</p>
                            <div className="info">
                              <span className="date">
                                <FaBirthdayCake className="icon" />{" "}
                                {new Date(wish.JoinDate).toLocaleDateString("en-GB", {
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
              </div>
            </>
          ) : (
            <div>No new joiners found.</div>
          )}
        </div>

        {/* Previous and Next controls */}
        <button
          className="carousel-control-prev"
          type="button"
          onClick={handlePrev}
        >
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button
          className="carousel-control-next"
          type="button"
          onClick={handleNext}
        >
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>
    </div>
  );
}
