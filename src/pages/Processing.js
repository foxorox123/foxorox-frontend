import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase-config";

function Processing() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const plan = urlParams.get("plan");
    const email = urlParams.get("email");

    // Zapisz do localStorage na wypadek odświeżenia
    if (plan && email) {
      localStorage.setItem("postPaymentPlan", plan);
      localStorage.setItem("postPaymentEmail", email);
    }

    const localPlan = localStorage.getItem("postPaymentPlan");
    const localEmail = localStorage.getItem("postPaymentEmail");

    if (!localPlan || !localEmail) {
      navigate("/plans");
      return;
    }

    const timer = setTimeout(() => {
      onAuthStateChanged(auth, (user) => {
        if (user && user.email === localEmail) {
          localStorage.removeItem("postPaymentPlan");
          localStorage.removeItem("postPaymentEmail");

          if (localPlan.startsWith("basic")) {
            navigate("/downloads/basic");
          } else {
            navigate("/downloads/premium");
          }
        } else {
          navigate("/login");
        }
      });
    }, 2000); // symulacja czasu przetwarzania

    return () => clearTimeout(timer);
  }, [navigate, location]);

  return (
    <div style={{ color: "white", textAlign: "center", marginTop: "100px" }}>
      <h1>⏳ Processing your transaction...</h1>
      <p>Please wait while we verify your subscription and prepare your download.</p>
    </div>
  );
}

export default Processing;
