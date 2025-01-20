import React, { useState } from "react";
import { Container, Row, Col, Form, Button, Alert, Spinner } from "react-bootstrap";
import { FaEnvelope, FaLock, FaKey } from "react-icons/fa";
import showToast from "../utils/toastHelper";
import ConnectMe from "../config/connect";
import { apiCall } from "../utils/apiCall";
import { useNavigate } from "react-router-dom";



const Login = () => {
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [passwordOrOtp, setPasswordOrOtp] = useState("");
  const [isOtpLogin, setIsOtpLogin] = useState(false); // Toggle between password and OTP login
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleSendOtp = async () => {
    if (!emailOrPhone) {
      showToast("Please enter your email address.", "error");
      return;
    }
    setLoading(true);
    try {
      const url = `${ConnectMe.BASE_URL}/sso/sendOtp`;
      const payload = { email: emailOrPhone };
      const headers = { "Content-Type": "application/json" };
      const response = await apiCall("POST", url, headers, payload);

      if (response.success) {
        showToast("OTP sent to your email.", "success");
        setOtpSent(true);
      } else {
        showToast(response.message || "Failed to send OTP.", "error");
      }
    } catch (error) {
      showToast(`Error sending OTP: ${error.message}`, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!emailOrPhone || !passwordOrOtp) {
      showToast("Please fill in all required fields.", "error");
      return;
    }
    setLoading(true);
    try {
      const url = `${ConnectMe.BASE_URL}/sso/login`;
      const payload = isOtpLogin
        ? { email: emailOrPhone, otp: passwordOrOtp }
        : { email: emailOrPhone, password: passwordOrOtp };
      const headers = { "Content-Type": "application/json" };
      const response = await apiCall("POST", url, headers, payload);

      if (response.success) {
        showToast("Login successful!", "success");
        navigate("/"); // Redirect to the home page or any other route
      } else {
        showToast(response.message || "Login failed. Please try again.", "error");
      }
    } catch (error) {
      showToast(`Error during login: ${error.message}`, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <div className="p-4 shadow rounded bg-white">
            <h3 className="text-center mb-4">Login</h3>

            <Form>
              {/* Email Input */}
              <Form.Group className="mb-3" controlId="formEmail">
                <Form.Label>
                  <FaEnvelope /> Email Address
                </Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter your email"
                  value={emailOrPhone}
                  onChange={(e) => setEmailOrPhone(e.target.value)}
                  required
                />
              </Form.Group>

              {/* OTP or Password Input */}
              <Form.Group className="mb-3" controlId="formPasswordOrOtp">
                <Form.Label>
                  {isOtpLogin ? <FaKey /> : <FaLock />}{" "}
                  {isOtpLogin ? "OTP" : "Password"}
                </Form.Label>
                <Form.Control
                  type={isOtpLogin ? "text" : "password"}
                  placeholder={isOtpLogin ? "Enter OTP" : "Enter Password"}
                  value={passwordOrOtp}
                  onChange={(e) => setPasswordOrOtp(e.target.value)}
                  required
                />
              </Form.Group>

              {/* Toggle Login Mode */}
              <Form.Group className="mb-3">
                <Form.Check
                  type="switch"
                  id="otpLoginSwitch"
                  label="Login with OTP"
                  checked={isOtpLogin}
                  onChange={(e) => setIsOtpLogin(e.target.checked)}
                />
              </Form.Group>

              {/* Send OTP Button */}
              {isOtpLogin && (
                <Button
                  variant="primary"
                  onClick={handleSendOtp}
                  disabled={loading || otpSent}
                  className="w-100 mb-3"
                >
                  {loading && otpSent ? (
                    <Spinner animation="border" size="sm" />
                  ) : (
                    "Send OTP"
                  )}
                </Button>
              )}

              {/* Login Button */}
              <Button
                variant="success"
                onClick={handleLogin}
                disabled={loading}
                className="w-100"
              >
                {loading ? (
                  <Spinner animation="border" size="sm" />
                ) : (
                  "Login"
                )}
              </Button>

              {/* OTP Sent Alert */}
              {otpSent && (
                <Alert variant="info" className="mt-3">
                  OTP has been sent to your email. Please check your inbox.
                </Alert>
              )}
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
