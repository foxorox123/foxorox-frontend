// src/pages/Processing.jsx
import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Processing = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const plan = searchParams.get("plan");
    const email = searchParams.get("email");
    const sessionId =
      localStorage.getItem("session_id") || sessionStorage.getItem("session_id");

    if (sessionId) {
      fetch(
        `https://foxorox-backend.onrender.com/payment-status?session_id=${sessionId}`
      )
        .then((res) => res.json())
        .then((data) => {
          if (data.status === "paid" || data.status === "no_payment_required") {
            // ✅ Payment completed
            localStorage.removeItem("postPaymentPlan");
            localStorage.removeItem("postPaymentEmail");
            localStorage.removeItem("session_id");
            sessionStorage.removeItem("postPaymentPlan");
            sessionStorage.removeItem("postPaymentEmail");
            sessionStorage.removeItem("session_id");
            navigate("/dashboard");
          } else {
            // ❗ Payment not completed yet, try again later
            setTimeout(() => window.location.reload(), 3000);
          }
        })
        .catch((err) => {
          console.error("Payment status check failed:", err);
        });
    } else {
      console.warn("Missing session ID");
    }
  }, [navigate, location]);

  return (
    <div style={{ color: "white", textAlign: "center", padding: "2rem" }}>
      <h2>⏳ Processing Payment...</h2>
      <p>Please wait while we verify your payment. Do not close this page.</p>
    </div>
  );
};

export default Processing;
