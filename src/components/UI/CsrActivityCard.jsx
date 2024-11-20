import React from "react";
import { LiaHandPeace } from "react-icons/lia";
import { HiArrowCircleRight } from "react-icons/hi";

export default function CsrActivityCard() {
  return (
    <div className="card mb-3">
      <div className="card-header d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center">
          <LiaHandPeace className="me-2" />
          <h5 className="mb-0">CSR Activity </h5>
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
                Opening Ceremony of Swaroop Negar (Prithivi ratan green) Clinic
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
                Opening Ceremony of Swaroop Negar (Prithivi ratan green) Clinic
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
