import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { auth } from "../firebase-config";
import { onAuthStateChanged } from "firebase/auth";

function Processing() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const plan = params.get("plan");
  const email = params.get("email");

  useEffect(() => {
    const waitForUser = () => {
      onAuthStateChanged(auth, (user) => {
        if (!user || user.email !== email) return;

        if (plan.startsWith("basic")) {
          navigate("/downloads/basic");
        } else {
          navigate("/downloads/premium");
        }
      });
    };

    const timer = setTimeout(waitForUser, 3000); // wait 3s to simulate Stripe response
    return () => clearTimeout(timer);
  }, [navigate, plan, email]);

  return (
    <div style={{ color: "white", textAlign: "center", marginTop: 100 }}>
      <h1>⏳ Processing your transaction...</h1>
      <p>Please wait while we verify your subscription and prepare your download.</p>
    </div>
  );
}

export default Processing;
