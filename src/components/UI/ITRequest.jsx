import React from "react";
import { FaInternetExplorer } from "react-icons/fa";
import { FaUsersGear } from "react-icons/fa6";
import { HiArrowCircleRight, HiUserRemove } from "react-icons/hi";
import { MdAttachEmail } from "react-icons/md";
import { TiUserAdd } from "react-icons/ti";
import { useNavigate } from "react-router-dom";
export default function ITRequest() {
  const navigate = useNavigate();

  return (
    <div
      className="card mb-3"
      onClick={() => {
        navigate("/ITService");
      }}
    >
      <div className="card-header d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center">
          <FaUsersGear className="me-2" />
          <h5 className="mb-0">IT Request</h5>
        </div>
        <a href="#" className="text-decoration-none">
          View All <HiArrowCircleRight />
        </a>
      </div>
      <div className="card-body card-scroll">
        <div className="d-flex align-items-center mb-4">
          <div className="user-icon me-3">
            <TiUserAdd />
          </div>
          <div className="text-primary">
            <h5 className="mb-0">New User Addition.</h5>
          </div>
        </div>
        <div className="d-flex align-items-center mb-4">
          <div className="user-icon me-3">
            <HiUserRemove />
          </div>
          <div className="text-primary">
            <h5 className="mb-0"> User Deletion.</h5>
          </div>
        </div>
        <div className="d-flex align-items-center mb-4">
          <div className="user-icon me-3">
            <MdAttachEmail />
          </div>
          <div className="text-primary">
            <h5 className="mb-0">New Email Creation.</h5>
          </div>
        </div>
        <div className="d-flex align-items-center mb-5">
          <div className="user-icon me-3">
            <FaInternetExplorer />
          </div>
          <div className="text-primary">
            <h5 className="mb-0"> Internet / VPN for Employee.</h5>
          </div>
        </div>
        <a href="#" className="text-decoration-none">
          Read More +
        </a>
      </div>
    </div>
  );
}
