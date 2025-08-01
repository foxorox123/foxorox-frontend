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

  const renderMessage = () => {
    switch (status) {
      case "checking":
        return (
          <>
            <h2>⏳ Processing Payment...</h2>
            <p>Checking your payment status...</p>
          </>
        );
      case "retrying":
        return (
          <>
            <h2>🔁 Still waiting...</h2>
            <p>Retrying in a few seconds...</p>
          </>
        );
      case "failed":
        return (
          <>
            <h2>❌ Payment failed or cancelled</h2>
            <p>Redirecting you back to pricing...</p>
          </>
        );
      case "error":
        return (
          <>
            <h2>⚠️ Unexpected error</h2>
            <p>Redirecting to home...</p>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div style={{ color: "white", textAlign: "center", padding: "2rem" }}>
      {renderMessage()}
    </div>
  );
};

export default Processing;
