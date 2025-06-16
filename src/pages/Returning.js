import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase-config";

const Returning = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const plan = params.get("plan");
  const email = params.get("email");

  useEffect(() => {
    if (plan && email) {
      localStorage.setItem("postPaymentPlan", plan);
      localStorage.setItem("postPaymentEmail", email);
      sessionStorage.setItem("postPaymentPlan", plan);
      sessionStorage.setItem("postPaymentEmail", email);
    }

    const unsubscribe = onAuthStateChanged(auth, (usr) => {
      if (usr && usr.email === email && usr.emailVerified) {
        navigate(`/processing?plan=${encodeURIComponent(plan)}&email=${encodeURIComponent(email)}`);
      } else {
        // Czeka na odświeżenie auth
        console.log("Czekam na użytkownika...");
      }
    });

    return () => unsubscribe();
  }, [navigate, plan, email]);

  return (
    <div style={{ color: "white", textAlign: "center", marginTop: "80px" }}>
      <h2>🔁 Wracamy z Stripe...</h2>
      <p>Sprawdzanie sesji logowania...</p>
    </div>
  );
};

export default Returning;
