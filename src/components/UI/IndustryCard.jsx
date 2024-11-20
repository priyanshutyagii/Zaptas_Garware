import React from "react";
import { FaRegNewspaper } from "react-icons/fa";
import { HiArrowCircleRight } from "react-icons/hi";

export default function IndustryCard() {
  return (
    <div className="card mb-3">
      <div className="card-header d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center">
          <FaRegNewspaper className="me-2" />
          <h5 className="mb-0">Industry News </h5>
        </div>
        <a href="#" className="text-decoration-none">
          View All <HiArrowCircleRight />
        </a>
      </div>
      <div className="card-body">
        <div>
          <div className="d-flex align-items-start">
            <div className="csrimg">
              <img src="\csrimg.PNG" alt="CSR" />
            </div>
            <div className="announcement-disc">
              <p className="card-text">
                Finance Minister Nirmala Sitharaman presented a record seventh
                consecutive Budget on July 23,...
              </p>
              <a href="#" className="text-decoration-none">
                Read More +
              </a>
            </div>
          </div>
        </div>
        <div>
          <div className="d-flex align-items-start pt-3">
            <div className="csrimg">
              <img src="\csrimg.PNG" alt="CSR" />
            </div>
            <div className="announcement-disc">
              <p className="card-text">
                ShareDrop is a free, open- source web app that allows you to
                easily and securely sharefiles directly between devices
                without...
              </p>
              <a href="#" className="text-decoration-none">
                Read More +
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
