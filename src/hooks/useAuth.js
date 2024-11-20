// hooks/useAuth.js
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const useAuth = () => {
  const navigate = useNavigate();

  const isAuthenticated = () => {
    return !!localStorage.getItem("authToken");
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    navigate("/login", { replace: true });
  };

  return { isAuthenticated, logout };
};
