import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { auth } from "../firebase-config";
import { onAuthStateChanged } from "firebase/auth";

const Processing = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const plan = params.get("plan");
  const email = params.get("email");

  const [status, setStatus] = useState("processing");
  const [secondsLeft, setSecondsLeft] = useState(90);

  useEffect(() => {
    let interval;
    let confirmed = false;

    const checkSubscription = (currentEmail) => {
      fetch("https://foxorox-backend.onrender.com/check-subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: currentEmail, device_id: "web" }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.active) {
            confirmed = true;
            localStorage.removeItem("postPaymentPlan");
            localStorage.removeItem("postPaymentEmail");
            sessionStorage.removeItem("postPaymentPlan");
            sessionStorage.removeItem("postPaymentEmail");

            if (data.plan.startsWith("basic")) {
              navigate("/downloads/basic");
            } else {
              navigate("/downloads/premium");
            }
          }
        })
        .catch((err) => {
          console.error("Błąd backendu:", err);
          setStatus("error");
        });
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.email === email) {
        checkSubscription(email);
      }
    });

    interval = setInterval(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);

    const timeout = setTimeout(() => {
      if (!confirmed) {
        setStatus("error");
        navigate("/login");
      }
    }, 90000); // 90 sekund

    return () => {
      unsubscribe();
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [navigate, email]);

  return (
    <div style={{ color: "white", textAlign: "center", marginTop: "100px" }}>
      {status === "processing" ? (
        <>
          <h1>⏳ Processing your transaction...</h1>
          <p>Please wait... ({secondsLeft}s remaining)</p>
        </>
      ) : (
        <>
          <h1>⚠️ Could not confirm your subscription</h1>
          <p>Redirecting to login...</p>
        </>
      )}
    </div>
  );
};

export default Processing;
