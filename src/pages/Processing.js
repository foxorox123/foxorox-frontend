import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase-config";

const Processing = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  const planFromUrl = params.get("plan");
  const emailFromUrl = params.get("email");

  useEffect(() => {
    const timer = setTimeout(() => {
      onAuthStateChanged(auth, (user) => {
        if (user && user.email === emailFromUrl) {
          if (planFromUrl?.startsWith("basic")) {
            navigate("/downloads/basic");
          } else {
            navigate("/downloads/premium");
          }
        } else {
          navigate("/login");
        }
      });
    }, 3000); // czas symulowanego "processing"

    return () => clearTimeout(timer);
  }, [navigate, planFromUrl, emailFromUrl]);

  return (
    <div style={{ color: "white", textAlign: "center", marginTop: "100px" }}>
      <h1>⏳ Processing your transaction...</h1>
      <p>Please wait while we verify your subscription and prepare your download.</p>
    </div>
  );
};

export default Processing;
