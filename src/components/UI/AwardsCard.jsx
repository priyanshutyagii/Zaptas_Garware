import React from "react";
import { HiArrowCircleRight } from "react-icons/hi";
import "./AwardsCard.css";
import { FaAward } from "react-icons/fa";

export default function AwardsCard() {
  return (
    <div className="card mb-3">
      <div className="card-header d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center">
          <FaAward className="me-2" />
          <h5 className="mb-0">Awards / Recognition</h5>
        </div>
        <a href="#" className="text-decoration-none">
          View All <HiArrowCircleRight />
        </a>
      </div>
      <div className="card-body">
        <div className="d-flex align-items-center mb-5">
          {/* User Image */}
          <div className="user-img me-3">
            <img src="\user.PNG" alt="User" />
          </div>
          <div className="flex-grow-1">
            <h6 className="mb-0">
              Vijay Kumar Tiwari Scholar of the Monthsjuly2023
            </h6>
          </div>
          <button className="btn btn-danger wishbtn">Send Wish</button>
        </div>
        <div className="d-flex align-items-center mb-5">
          {/* User Image */}
          <div className="user-img me-3">
            <img src="\user.PNG" alt="User" />
          </div>
          <div className="flex-grow-1">
            <h6 className="mb-0">
              Vijay Kumar Tiwari Scholar of the Monthsjuly2023
            </h6>
          </div>
          <button className="btn btn-danger wishbtn">Send Wish</button>
        </div>
        <div className="d-flex align-items-center mb-5">
          {/* User Image */}
          <div className="user-img me-3">
            <img src="\user.PNG" alt="User" />
          </div>
          <div className="flex-grow-1">
            <h6 className="mb-0">
              Vijay Kumar Tiwari Scholar of the Monthsjuly2023
            </h6>
          </div>
          <button className="btn btn-danger wishbtn">Send Wish</button>
        </div>
        <div className="d-flex align-items-center">
          {/* User Image */}
          <div className="user-img me-3">
            <img src="\user.PNG" alt="User" />
          </div>
          <div className="flex-grow-1">
            <h6 className="mb-0">
              Vijay Kumar Tiwari Scholar of the Monthsjuly2023
            </h6>
          </div>
          <button className="btn btn-danger wishbtn">Send Wish</button>
        </div>
      </div>
    </div>
  );
}
