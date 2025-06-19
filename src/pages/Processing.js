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
    const session_id =
        localStorage.getItem("session_id") || sessionStorage.getItem("session_id");
 const [attempts, setAttempts] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(90);
  const [message, setMessage] = useState("⏳ Processing your transaction...");

  useEffect(() => {
    let retries = 0;
    const maxRetries = 30;
 
   const interval = setInterval(() => {
       fetch(`https://foxorox-backend.onrender.com/payment-status?session_id=${session_id}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, device_id: "web" }),
        })
        .then(res => res.json())
        .then(data => {
          if (data.status === "paid") {
            setMessage("success");
            clearInterval(interval);
          } else if (data.status === "failed" || data.status === "canceled") {
            setMessage("failed");
            clearInterval(interval);
          } else {
            setAttempts(prev => prev + 1);
            if (attempts >= 10) {
              setStatus("timeout");
              clearInterval(interval);
            }
          }
        })
        .catch(() => {
          setMessage("error");
          clearInterval(interval);
        });
    }, 3000); // sprawdza co 3 sekundy
 

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.email === email) {
        // ✅ Check subscription on backend
        fetch("https://foxorox-backend.onrender.com/check-subscription", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, device_id: "web" }),
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.active) {
              // 🔄 Delayed clearing of localStorage
              setTimeout(() => {
                localStorage.removeItem("postPaymentPlan");
                localStorage.removeItem("postPaymentEmail");
              }, 5000);

              if (data.plan.startsWith("basic")) {
                navigate("/downloads/basic");
              } else {
                navigate("/downloads/premium");
              }
            } else {
              retries++;
              if (retries >= maxRetries) {
                setMessage("⚠️ Subscription still inactive. Please log in again.");
                setTimeout(() => navigate("/login"), 4000);
              }
            }
          })
          .catch((err) => {
            console.error("Error checking subscription:", err);
            setMessage("❌ Error verifying subscription.");
            setTimeout(() => navigate("/login"), 5000);
          });
      }
    });

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, [navigate, email, plan]);

  return (
    <div style={{ color: "white", textAlign: "center", marginTop: "100px" }}>
      <h1>{message}</h1>
    </div>
  );
};

export default Processing;
