import { useState } from "react";
import ConnectMe from "../../config/connect";
import { apiCall } from "../../utils/apiCall";
import showToast from "../../utils/toastHelper";
import { Button, Card, Col, Container, Form, Row, Spinner } from "react-bootstrap";

const UpdatePassword = ({ email }) => {
  const [otp, setOtp] = useState(""); // OTP entered by the user
  const [newPassword, setNewPassword] = useState(""); // New password
  const [confirmPassword, setConfirmPassword] = useState(""); // Confirm password
  const [otpSent, setOtpSent] = useState(false); // OTP sent status
  const [otpVerified, setOtpVerified] = useState(false); // OTP verified status
  const [loading, setLoading] = useState(false); // Loading spinner status

  // Function to send OTP
  const handleSendOtp = async () => {
    setLoading(true);
    try {
      const url = `${ConnectMe.BASE_URL}/sso/sendOtp`;
      const response = await apiCall("POST", url, { "Content-Type": "application/json" }, { email });

      if (response.success) {
        showToast("OTP sent successfully! Check your email.", "success");
        setOtpSent(true);
      } else {
        showToast(response.message || "Error sending OTP. Try again.", "error");
      }
    } catch (error) {
      showToast("Error sending OTP. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  // Function to verify OTP
  const handleVerifyOtp = async () => {
    setLoading(true);
    try {
      const url = `${ConnectMe.BASE_URL}/sso/verifyOtp`;

      const response = await apiCall(
        "POST",
        url,
        { "Content-Type": "application/json" },
        { email, otp }
      );

      if (response.success) {
        showToast("OTP verified successfully!", "success");
        setOtpVerified(true);
      } else {
        showToast(response.message || "Invalid OTP. Try again.", "error");
      }
    } catch (error) {
      showToast("Error verifying OTP. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  // Function to update the password
  const handleUpdatePassword = async () => {
    if (newPassword !== confirmPassword) {
      showToast("Passwords do not match. Please try again.", "error");
      return;
    }

    setLoading(true);
    try {
      const url = `${ConnectMe.BASE_URL}/sso/updatePassword`;
      const response = await apiCall(
        "PUT",
        url,
        { "Content-Type": "application/json" },
        { email, newPassword }
      );

      if (response.success) {
        showToast("Password updated successfully!", "success");
        setOtp("");
        setNewPassword("");
        setConfirmPassword("");
        setOtpSent(false);
        setOtpVerified(false);
      } else {
        showToast(response.message || "Error updating password.", "error");
      }
    } catch (error) {
      showToast("Error updating password. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <Card>
            <Card.Header className="text-center bg-primary text-white">
              <h4>Update Password</h4>
            </Card.Header>
            <Card.Body>
              <Form>
                {/* Email Field */}
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control type="text" value={email} readOnly />
                </Form.Group>

                {/* OTP Field */}
                {otpSent && (
                  <Form.Group className="mb-3">
                    <Form.Label>OTP</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter the OTP"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      disabled={otpVerified}
                    />
                  </Form.Group>
                )}

                {/* New Password Fields */}
                {otpVerified && (
                  <>
                    <Form.Group className="mb-3">
                      <Form.Label>New Password</Form.Label>
                      <Form.Control
                        type="password"
                        placeholder="Enter new password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Confirm Password</Form.Label>
                      <Form.Control
                        type="password"
                        placeholder="Confirm new password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                    </Form.Group>
                  </>
                )}

                {/* Action Buttons */}
                <div className="d-flex justify-content-between">
                  {!otpSent ? (
                    <Button variant="primary" onClick={handleSendOtp} disabled={loading}>
                      {loading ? <Spinner animation="border" size="sm" /> : "Send OTP"}
                    </Button>
                  ) : !otpVerified ? (
                    <Button variant="warning" onClick={handleVerifyOtp} disabled={loading || !otp}>
                      {loading ? <Spinner animation="border" size="sm" /> : "Verify OTP"}
                    </Button>
                  ) : (
                    <Button
                      variant="success"
                      onClick={handleUpdatePassword}
                      disabled={loading || !newPassword || !confirmPassword}
                    >
                      {loading ? <Spinner animation="border" size="sm" /> : "Update Password"}
                    </Button>
                  )}
                  <Button variant="secondary" onClick={() => window.location.reload()}>
                    Reset
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default UpdatePassword;
