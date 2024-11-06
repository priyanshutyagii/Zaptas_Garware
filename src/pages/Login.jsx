import React, { useState } from "react";
import "./Login.css";

export default function Login() {
  const [isOtpLogin, setIsOtpLogin] = useState(false);

  const toggleLoginMethod = () => {
    setIsOtpLogin(!isOtpLogin);
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h3>{isOtpLogin ? "Login with OTP" : "Login with Password"}</h3>

        <div className="form-group">
          <label>Email or Mobile Number</label>
          <input
            type="text"
            placeholder="Enter email or mobile number"
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label>{isOtpLogin ? "OTP" : "Password"}</label>
          <input
            type={isOtpLogin ? "text" : "password"}
            placeholder={isOtpLogin ? "Enter OTP" : "Enter password"}
            className="form-control"
          />
        </div>

        <button className="toggle-btn" onClick={toggleLoginMethod}>
          {isOtpLogin ? "Login with Password" : "Login with OTP"}
        </button>

        <button className="login-btn">Login</button>
      </div>
    </div>
  );
}
