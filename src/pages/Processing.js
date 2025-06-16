// src/pages/Processing.js
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase-config";
import { useLocation } from "react-router-dom";

const Processing = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const plan = params.get("plan");
  const email = params.get("email");

function Processing() {
  const navigate = useNavigate();

  useEffect(() => {
    const check = () => {
      const plan = localStorage.getItem("postPaymentPlan");
      const email = localStorage.getItem("postPaymentEmail");

      if (!plan || !email) {
        navigate("/plans");
        return;
      }

      onAuthStateChanged(auth, (user) => {
        if (user && user.email === email) {
          localStorage.removeItem("postPaymentPlan");
          localStorage.removeItem("postPaymentEmail");

          if (plan.startsWith("basic")) {
            navigate("/downloads/basic");
          } else {
            navigate("/downloads/premium");
          }
        }
      });
    };

    const timer = setTimeout(check, 2000); // simulate processing delay
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div style={{ color: "white", textAlign: "center", marginTop: "100px" }}>
      <h1>⏳ Processing your transaction...</h1>
      <p>Please wait while we verify your subscription and prepare your download.</p>
    </div>
  );
}

export default Processing;
