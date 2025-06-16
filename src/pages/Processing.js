import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Processing = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const plan = params.get("plan");
  const email = params.get("email");

  const [status, setStatus] = useState("⏳ Verifying your subscription...");

  useEffect(() => {
    if (!email) {
      setStatus("❌ Missing email. Redirecting...");
      setTimeout(() => navigate("/login"), 3000);
      return;
    }

    const device_id = window.navigator.userAgent + "_id"; // you can improve this

    fetch("https://foxorox-backend.onrender.com/check-subscription", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, device_id }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.active) {
          localStorage.removeItem("postPaymentPlan");
          localStorage.removeItem("postPaymentEmail");

          if (data.plan.startsWith("basic")) {
            navigate("/downloads/basic");
          } else {
            navigate("/downloads/premium");
          }
        } else {
          setStatus("⚠️ No active subscription found. Redirecting...");
          setTimeout(() => navigate("/login"), 4000);
        }
      })
      .catch((err) => {
        console.error(err);
        setStatus("❌ Server error. Try again.");
        setTimeout(() => navigate("/login"), 4000);
      });
  }, [navigate, email, plan]);

  return (
    <div style={{ color: "white", textAlign: "center", marginTop: "100px" }}>
      <h1>{status}</h1>
      <p>This may take a few seconds. Please do not refresh the page.</p>
    </div>
  );
};

export default Processing;
