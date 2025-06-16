// ✅ Processing.js - POPRAWIONY
import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase-config";

function Processing() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const planParam = params.get("plan");
  const emailParam = params.get("email");

  useEffect(() => {
    const plan = planParam || localStorage.getItem("postPaymentPlan");
    const email = emailParam || localStorage.getItem("postPaymentEmail");

    if (!plan || !email) {
      navigate("/plans");
      return;
    }

    onAuthStateChanged(auth, (user) => {
      if (!user) {
        console.log("User not logged in after Stripe, redirecting to login");
        navigate("/login");
        return;
      }

      if (user.email === email) {
        localStorage.removeItem("postPaymentPlan");
        localStorage.removeItem("postPaymentEmail");

        if (plan.startsWith("basic")) {
          navigate("/downloads/basic");
        } else {
          navigate("/downloads/premium");
        }
      } else {
        alert("User mismatch. Please log in again.");
        navigate("/login");
      }
    });
  }, [navigate, planParam, emailParam]);

  return (
    <div style={{ color: "white", textAlign: "center", marginTop: "100px" }}>
      <h1>⏳ Processing your transaction...</h1>
      <p>Please wait while we verify your subscription and prepare your download.</p>
    </div>
  );
}

export default Processing;