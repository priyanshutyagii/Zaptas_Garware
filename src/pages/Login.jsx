import React, { useState } from "react";

import "./Login.css";
import ConnectMe from "../config/connect";
import { addTokenToLocalStorage, apiCall } from "../utils/apiCall";
import { useNavigate } from "react-router-dom";
import showToast from "../utils/toastHelper";


export default function Login() {
  const [isOtpLogin, setIsOtpLogin] = useState(false);
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [passwordOrOtp, setPasswordOrOtp] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();



  const toggleLoginMethod = () => {
    setIsOtpLogin(!isOtpLogin);
  };

  const handleLogin = async () => {
    try {
      const url = `${ConnectMe.BASE_URL}/sso/login`;
      const payload = isOtpLogin
        ? { email: emailOrPhone, otp: passwordOrOtp }
        : { email: emailOrPhone, password: passwordOrOtp };

      const headers = { "Content-Type": "application/json" };
      const response = await apiCall("POST", url, headers, payload);

      if (response.success) {
        addTokenToLocalStorage(response?.data?.token);
        showToast("Login successful!", 'success');
        navigate("/");  // Redirect to the home page or any other route
      } else {
        showToast("Login failed.", 'error');
      }
    } catch (error) {
      showToast(`Error: ${error.message}`, 'error');
    }
  };

  const handleSendOtp = async () => {
    try {
      const url = `${ConnectMe.BASE_URL}/sso/sendOtp`;
      const payload = { email: emailOrPhone };
      const headers = { "Content-Type": "application/json" };
      const response = await apiCall("POST", url, headers, payload);
      if (response.success) {
        showToast("Otp has been sent to your email", 'success')
      } else {
        showToast("Error sending OTP", 'error')
      }

    } catch (error) {
      showToast(`Error sending OTP: ${error.message}`, 'error');
    }
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
            value={emailOrPhone}
            onChange={(e) => setEmailOrPhone(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>{isOtpLogin ? "OTP" : "Password"}</label>
          <input
            type={isOtpLogin ? "text" : "password"}
            placeholder={isOtpLogin ? "Enter OTP" : "Enter password"}
            className="form-control"
            value={passwordOrOtp}
            onChange={(e) => setPasswordOrOtp(e.target.value)}
          />
        </div>
        {isOtpLogin && (
          <button className="otp-btn" onClick={handleSendOtp}>
            Send OTP
          </button>
        )}
        <button className="toggle-btn" onClick={toggleLoginMethod}>
          {isOtpLogin ? "Login with Password" : "Login with OTP"}
        </button>
        <button className="login-btn" onClick={handleLogin}>
          Login
        </button>
        {message && <p>{message}</p>}
      </div>
    </div>
  );
}
