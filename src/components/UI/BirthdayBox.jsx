import { useState, useEffect } from "react";
import { FaBirthdayCake, FaMapMarkerAlt } from "react-icons/fa";
import "./BirthdayBox.css";
import ConnectMe from "../../config/connect";
import { apiCall } from "../../utils/apiCall";

export default function BirthdayBox() {
  const [birthdayWishes, setBirthdayWishes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [currentIndex, setCurrentIndex] = useState(0);

  const sampleData = [
    {
      FirstName: "John",
      LastName: "Doe",
      EmployeeCode: "EMP001",
      BirthDate: "1990-01-10",
      CustomField6: "Software Engineer",
    },
    {
      FirstName: "Jane",
      LastName: "Smith",
      EmployeeCode: "EMP002",
      BirthDate: "1992-02-15",
      CustomField6: "Project Manager",
    },
    {
      FirstName: "Sam",
      LastName: "Wilson",
      EmployeeCode: "EMP003",
      BirthDate: "1988-03-20",
      CustomField6: "HR Manager",
    },
  ];

  const sampleData2 = ["./Group10.png", "./Group11.png", "./Group12.png"];

  const handleNext = () => {
    if ((currentIndex + 1) * 3 < birthdayWishes.length) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  // Fetch birthday wishes using the API
  const fetchBirthdayWishes = async () => {
    try {
      setLoading(true); // Show loader while fetching
      const url = `${ConnectMe.BASE_URL}/hrms/birthday-wishes`; // Replace with actual URL
      const token = localStorage.getItem("authToken"); // Assuming the token is stored in localStorage
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      const response = await apiCall("GET", url, headers);
      if (response.success) {
        setBirthdayWishes(response?.data?.birthdayWishes);
      } else {
        setError("Failed to fetch birthday wishes.");
        setBirthdayWishes(sampleData2); // Use sample data in case of error
      }
    } catch (err) {
      setError("Error fetching birthday wishes.");
      setBirthdayWishes(sampleData2); // Use sample data in case of error
    } finally {
      setLoading(false); // Hide loader after fetching
    }
  };

  useEffect(() => {
    fetchBirthdayWishes();
  }, []);

  return (
    <div className="row">
      <div className="col-md-12">
        <div className=" wish mb-5">
          <div className="card-header">
            <FaBirthdayCake /> &nbsp;Birthday Wishes
          </div>
        </div>
      </div>

      <div
        id="birthdayCarousel"
        className="carousel slide col-md-12"
        data-bs-ride="carousel"
        data-bs-interval="false"
      >
        {/* Carousel Items */}
        <div className="carousel-inner">
          {loading && (
            <div className="loading-spinner">
              <div className="spinner-border" role="status"></div>
              <span>Loading...</span>
            </div>
          )}
          {/* {error && !loading && <div>{error}</div>} */}
          {!loading && birthdayWishes.length > 0 && (
            // <div className="carousel-item active">
            <div className="row g-3">
              {" "}
              {/* Bootstrap gap class for spacing */}
              {birthdayWishes
                .slice(currentIndex * 3, currentIndex * 3 + 3)
                .map((wish, index) => (
                  <div className="col-md-3" key={index}>
                    <div className="card">
                      <img
                        src={wish}
                        className="card-img-top img-fluid"
                        alt={`Wish ${index + 1}`}
                      />
                    </div>
                  </div>
                ))}
            </div>

            // </div>
          )}
          {!loading && birthdayWishes.length === 0 && !error && (
            <div>No birthday wishes found.</div>
          )}
        </div>

        {/* Conditionally render carousel controls */}
        {!loading && !error && birthdayWishes.length > 0 && (
          <>
            <button
              className="carousel-control-prev"
              type="button"
              onClick={handlePrev}
            >
              <span
                className="carousel-control-prev-icon"
                aria-hidden="true"
              ></span>
              <span className="visually-hidden">Previous</span>
            </button>
            <button
              className="carousel-control-next"
              type="button"
              onClick={handleNext}
            >
              <span
                className="carousel-control-next-icon"
                aria-hidden="true"
              ></span>
              <span className="visually-hidden">Next</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
}
