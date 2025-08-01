import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Processing = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [status, setStatus] = useState("checking");

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const sessionId = searchParams.get("session_id");

    if (!sessionId) {
      clearStorageAndRedirect();
      return;
    }

    fetch(`https://foxorox-backend.onrender.com/payment-status?session_id=${sessionId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "paid" || data.status === "no_payment_required") {
          setStatus("success");
          navigate("/dashboard");
        } else if (data.status === "unpaid" || data.status === "open") {
          setStatus("failed");
          clearStorageAndRedirect();
        } else {
          setStatus("retrying");
          setTimeout(() => window.location.reload(), 5000);
        }
      })
      .catch((err) => {
        console.error("Payment status check failed:", err);
        setStatus("error");
        clearStorageAndRedirect();
      });
  }, [navigate, location]);

  const clearStorageAndRedirect = () => {
    localStorage.removeItem("postPaymentPlan");
    localStorage.removeItem("postPaymentEmail");
    localStorage.removeItem("session_id");
    sessionStorage.removeItem("postPaymentPlan");
    sessionStorage.removeItem("postPaymentEmail");
    sessionStorage.removeItem("session_id");
    setTimeout(() => navigate("/"), 3000);
  };

  return (
    <div style={{ color: "white", textAlign: "center", padding: "2rem" }}>
      {status ===
