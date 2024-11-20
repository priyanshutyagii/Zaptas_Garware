import React from "react";
import "./BirthdayBox.css";
import { FaBirthdayCake, FaMapMarkerAlt } from "react-icons/fa";

export default function BirthdayBox() {
  return (
    <div className="row">
      <div className="col-md-3">
        <div className="card text-center wish">
          <div className="card-header">
            <FaBirthdayCake /> &nbsp;Birthday Wishes
          </div>
          <div className="card-body d-flex align-items-center justify-content-center">
            <button className="btn btn-primary cartbtn">Birthday</button>
          </div>
        </div>
      </div>
      <div className="col-md-3">
        <div className="wish-card">
          <div className="user-image">
            <img src="\user.PNG" alt="User" className="rounded-circle" />
          </div>
          <div className="wish-content">
            <h5 className="title">Mukesh singh</h5>

            <p className="message">Manager-Manfacturing(EandE)</p>

            <div className="info">
              <span className="location">
                <FaMapMarkerAlt className="icon" /> Chaubepur, Kanpur
              </span>
              <span className="date">
                <FaBirthdayCake className="icon" /> 10 May
              </span>
            </div>
            <button className="send-wish-btn">Send Wish</button>
          </div>
        </div>
      </div>
      <div className="col-md-3">
        <div className="wish-card">
          <div className="user-image">
            <img src="\user.PNG" alt="User" className="rounded-circle" />
          </div>
          <div className="wish-content">
            <h5 className="title">Mukesh singh</h5>

            <p className="message">Manager-Manfacturing(EandE)</p>

            <div className="info">
              <span className="location">
                <FaMapMarkerAlt className="icon" /> Chaubepur, Kanpur
              </span>
              <span className="date">
                <FaBirthdayCake className="icon" /> 10 May
              </span>
            </div>
            <button className="send-wish-btn">Send Wish</button>
          </div>
        </div>
      </div>
      <div className="col-md-3">
        <div className="wish-card">
          <div className="user-image">
            <img src="\user.PNG" alt="User" className="rounded-circle" />
          </div>
          <div className="wish-content">
            <h5 className="title">Mukesh singh</h5>

            <p className="message">Manager-Manfacturing(EandE)</p>

            <div className="info">
              <span className="location">
                <FaMapMarkerAlt className="icon" /> Chaubepur, Kanpur
              </span>
              <span className="date">
                <FaBirthdayCake className="icon" /> 10 May
              </span>
            </div>
            <button className="send-wish-btn">Send Wish</button>
          </div>
        </div>
      </div>
    </div>
  );
}
